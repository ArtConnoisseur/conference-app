import React from "react";

const JoinExistingCall = () => {
    return (
        <React.Fragment>
            <div>
                <h2>1. Start your Webcam</h2>
                <div className="videos">
                    <span>
                        <h3>Local Stream</h3>
                        <video
                            id="webcamVideo"
                            autoPlay
                            ref={webcamVideo}
                        ></video>
                    </span>
                    <span>
                        <h3>Remote Stream</h3>
                        <video
                            id="remoteVideo"
                            autoPlay
                            ref={answerVideo}
                        ></video>
                    </span>
                </div>
                <button id="webcamButton" onClick={handleLocalVideo}>
                    Start webcam
                </button>

                {/* <h2>2. Create a new Call</h2>
                <button id="callButton" onClick={handleCreateOffer}>
                    Create Call (offer)
                </button> */}

                <h2>2. Join an Existing Call</h2>
                {/* <p>Answer the call from a different browser window or device</p> */}

                <input id="callInput" ref={callInput} />
                <button id="answerButton" onClick={handleAnswer}>
                    Answer
                </button>

                <h2>3. Hangup</h2>

                <button id="hangupButton">Hangup</button>
            </div>
        </React.Fragment>
    );
};

export default JoinExistingCall;
