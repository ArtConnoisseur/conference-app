import './App.css'; 

import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { useRef } from 'react';
import { firebaseConfig } from './private-info';


firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore;

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  const pc = new RTCPeerConnection(servers);
  const webcamVideo = useRef(null); 

  let localStream = null;

  const handleLocalVideo = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    webcamVideo.current.srcObject = localStream;
  }
  
  return (
    <div className='app-container'>
      <video className='local-video' ref={webcamVideo} autoPlay>

      </video>
      <button onClick={() => handleLocalVideo()}>Show Local Video</button>
    </div>
  )
}

export default App