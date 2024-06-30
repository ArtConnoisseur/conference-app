import './App.css'; 

import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { useRef } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyDufMvsrNh3nPGgZuXjb1KNriG32Rm8u1U",
  authDomain: "conference-app-ab6e6.firebaseapp.com",
  projectId: "conference-app-ab6e6",
  storageBucket: "conference-app-ab6e6.appspot.com",
  messagingSenderId: "195726448004",
  appId: "1:195726448004:web:5a7a07a38339ef702839d1"
};

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

    webcamVideo.srcObject = localStream;
  }
  
  return (
    <div className='app-container'>
      <div className='local-video' ref={webcamVideo}>

      </div>
      <button onClick={() => handleLocalVideo()}>Show Local Video</button>
    </div>
  )
}

export default App


// const iceServers = [
//   { urls: "stun:stun.l.google.com:19302" },
//   { urls: "stun:stun.l.google.com:5349" },
//   { urls: "stun:stun1.l.google.com:3478" },
//   { urls: "stun:stun1.l.google.com:5349" },
//   { urls: "stun:stun2.l.google.com:19302" },
//   { urls: "stun:stun2.l.google.com:5349" },
//   { urls: "stun:stun3.l.google.com:3478" },
//   { urls: "stun:stun3.l.google.com:5349" },
//   { urls: "stun:stun4.l.google.com:19302" },
//   { urls: "stun:stun4.l.google.com:5349" }
// ];