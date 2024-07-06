import './Homepage.css'; 

import firebase from 'firebase/compat/app';

import { getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { useRef } from 'react';
import { firebaseConfig } from '../../private-info';


const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);


const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

let localStream = null;
let remoteStream = null; 

const calls = collection(db, 'calls');


function Homepage() {
  const webcamVideo = useRef(null); 
  const callInput = useRef(null);
  const answerVideo = useRef(null);

  const handleLocalVideo = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream(); 

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      })
    }

    webcamVideo.current.srcObject = localStream;
    answerVideo.current.srcObject = remoteStream;
  }

  const handleCreateOffer = async () => {
    const callDoc = doc(calls); 
    callInput.current.value = callDoc.id;

    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    pc.onicecandidate = (event) => {
      event.candidate && setDoc(doc(offerCandidates), event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);


    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, {offer});


    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });


    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  }


  const handleAnswer = async () => {
    const callId = callInput.current.value;
    const callDoc = doc(calls, `${callId}`); 
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    pc.onicecandidate = (event) => {
      event.candidate && setDoc(doc(answerCandidates), event.candidate.toJSON())
    };

    const callData = (await getDoc(callDoc)).data()

    const offerDescription = callData.offer; 
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    
    await updateDoc(callDoc, {answer});

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        if (change.type === 'added') {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  return (
    <div className='app-container'>
      <h2>1. Start your Webcam</h2>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video id="webcamVideo" autoPlay ref={webcamVideo}></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video id="remoteVideo" autoPlay ref={answerVideo}></video>
        </span>
      </div>
      <button id="webcamButton" onClick={handleLocalVideo}>Start webcam</button>

      <h2>2. Create a new Call</h2>
      <button id="callButton" onClick={handleCreateOffer}>Create Call (offer)</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>
      
      <input id="callInput" ref={callInput}/>
      <button id="answerButton" onClick={handleAnswer}>Answer</button>

      <h2>4. Hangup</h2>

      <button id="hangupButton">Hangup</button>

    </div>
  )
}

export default Homepage;