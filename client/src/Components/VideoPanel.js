import React, { useEffect, useReducer, useRef, useState } from "react";
// import VideoCard from './VideoCard';
import "./VideoPanel.css";
import "./VideoCard.css";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default function VideoPanel({
  roomName,
  socket,
  users,
  author,
  localStream,
}) {
  const { RTCPeerConnection, RTCSessionDescription } = window;
  // const peerConnection = new RTCPeerConnection();

  const reducer = (peerConnections, action) => {
    switch (action.type) {
      case "newcomerPeer":
        return setUpPeer(
          action.payload.data.uuid,
          action.payload.data.author,
          peerConnections
        );
      case "newcomerCalled":
        return action.payload.connection;

      case "gotLocalStream":
        return { ...peerConnections, localStream: action.payload.stream };

      case "callInitiated":
        return initCall(
          action.payload.data.uuid,
          action.payload.data.author,
          peerConnections
        );

      case "gotDescription":
        return setRemoteDescription(
          action.payload.data["uuid"],
          action.payload.data.sdp,
          peerConnections
        );

      case "setRemoteDescription":
        return action.payload.connections;

      case "goticeCandidate":
        return addIceCandidate(
          peerConnections,
          action.payload.data.socketId,
          action.payload.data.ice
        );

      default:
        return peerConnections;
    }
  };

  const [isCalling, setisCalling] = useState(false);

  function setUpPeer(peerUuid, displayName, peerConnections) {
    let connection = {
      ...peerConnections,
      [peerUuid]: {
        displayName: displayName,
        pc: new RTCPeerConnection(peerConnectionConfig),
      },
    };

    connection[peerUuid].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerUuid);
    connection[peerUuid].pc.ontrack = (event) =>
      gotRemoteStream(event, peerUuid);
    connection[peerUuid].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerUuid);
    connection[peerUuid].pc.addStream(localStream);
    return connection;
  }

  function initCall(peerUuid, displayName, peerConnections) {
    let connection = {
      ...peerConnections,
      [peerUuid]: {
        displayName: displayName,
        pc: new RTCPeerConnection(peerConnectionConfig),
      },
    };

    connection[peerUuid].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerUuid);
    connection[peerUuid].pc.ontrack = (event) =>
      gotRemoteStream(event, peerUuid);
    connection[peerUuid].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerUuid);
    // connection[peerUuid].pc.onsignalingstatechange = (e) => {  // Workaround for Chrome: skip nested negotiations
    // 	setisCalling( (connection[peerUuid].pc.signalingState != "stable") );
    //   }
    // console.log('localStream', peerConnections);
    connection[peerUuid].pc.addStream(localStream);

    connection[peerUuid].pc
      .createOffer()
      .then((description) => {
        connection[peerUuid].pc
          .setLocalDescription(description)
          .then(function () {
            dispatch({ type: "newcomerCalled", payload: { connection } });

            socket.emit("got description", {
              sdp: connection[peerUuid].pc.localDescription,
              uuid: socket.id,
              dest: peerUuid,
            });
          });
      })
      .catch((error) => console.log(error));
  }

  function gotIceCandidate(event, peerUuid) {
    // console.log('event.candidate' ,event.candidate);
    if (event.candidate != null) {
      socket.emit("iceCandidate", {
        roomName: roomName,
        ice: event.candidate,
        socketId: socket.id,
        dest: peerUuid,
      });
      // serverConnection.send(JSON.stringify({ 'ice': event.candidate, 'uuid': localUuid, 'dest': peerUuid }));
    }
  }

  function gotRemoteStream(event, peerUuid) {
    console.log(`GOT remote stream !!!, peer ${peerUuid}`);
    // console.log( event.streams[0]);
    visitorVideoRef.current.srcObject = event.streams[0];
    // console.log(event.streams[0]);
  }

  function checkPeerDisconnect(event, peerUuid) {
    console.log("Disconnect...");
    // var state = peerConnections[peerUuid].pc.iceConnectionState;
    // console.log(`connection with peer ${peerUuid} ${state}`);
    // if (state === "failed" || state === "closed" || state === "disconnected") {
    // delete peerConnections[peerUuid];
    // document.getElementById('videos').removeChild(document.getElementById('remoteVideo_' + peerUuid));
    // }
  }

  function setRemoteDescription(peerUuid, sdp, peerConnections) {
    let connections = { ...peerConnections };

    // console.log('peerConnections==', peerConnections);
    // console.log('connections==', connections);

    connections[peerUuid].pc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(function () {
        //

        // console.log('setRemoteDescription');
        // Only create answers in response to offers
        if (sdp.type === "offer") {
          // console.log("sdp.type === 'offer'");
          connections[peerUuid].pc
            .createAnswer()
            .then((description) => {
              if (isCalling) {
                console.log("SKIP nested negotiations");
                return { ...peerConnections };
              } else {
                console.log("isCalling");
                connections[peerUuid].pc
                  .setLocalDescription(description)
                  .then(function () {
                    setisCalling(true);
                    socket.emit("got description", {
                      sdp: connections[peerUuid].pc.localDescription,
                      uuid: socket.id,
                      dest: peerUuid,
                    });
                  });
              }
            })
            .catch((err) => console.log(err));
          dispatch({ type: "setRemoteDescription", payload: { connections } });

          // return {...connections}
        } else {
          // return {...connections}

          dispatch({ type: "setRemoteDescription", payload: { connections } });
        }
      })
      .catch((err) => console.log(err));

    return { ...connections };
  }

  function addIceCandidate(peerConnections, peerUuid, ice) {
    // console.log('addIceCandidate');
    // console.log('peerUuid', peerUuid);

    // console.log('peerConnections', peerConnections);

    peerConnections[peerUuid].pc
      .addIceCandidate(new RTCIceCandidate(ice))
      .catch((err) => console.log(err));
    return peerConnections;
  }

  const [peerConnections, dispatch] = useReducer(reducer, {});

  const videoRef = useRef(null);
  const visitorVideoRef = useRef(null);

  // useEffect( () => {
  // 	console.log('peerConnections CHANGED', peerConnections);
  // }, [peerConnections])

  // useEffect( () => {
  // 	console.log('localStream CHANGED', localStream);
  // }, [localStream])

  useEffect(() => {
    // connectToLocalCamera();
    videoRef.current.srcObject = localStream;
    call(roomName);

    socket.on("call-made", (data) => {
      // console.log('call-made');
      dispatch({ type: "newcomerPeer", payload: { data } });
      socket.emit("initiate call", {
        roomName,
        uuid: socket.id,
        dest: data.uuid,
        author,
      });
    });

    socket.on("call initiated", (data) => {
      // console.log('call initiated');
      dispatch({ type: "callInitiated", payload: { data } });
    });

    socket.on("got description", (data) => {
      console.log("I got description");
      dispatch({ type: "gotDescription", payload: { data } });
    });

    socket.on("goticeCandidate", (data) => {
      // console.log('I got iceCandidate');
      dispatch({ type: "goticeCandidate", payload: { data } });
    });
  }, []);

  // const connectToLocalCamera = () => {
  // 	navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  // 		.then(stream => {
  // 			videoRef.current.srcObject = stream;
  // 			window.localStream = stream;

  // 			// dispatch({ type: 'gotLocalStream', payload: {stream} })
  // 			setLocalStream(stream);
  // 		})
  // 		.then(call(roomName));
  // }

  useEffect(() => {
    console.log("isCalling (render)", isCalling);

    // 	callUser();
    // 	socket.on("call-made", async data => {
    // 		console.log(data);
    // 		await peerConnection.setRemoteDescription(
    // 		  new RTCSessionDescription(data.offer)
    // 		);
    // 		const answer = await peerConnection.createAnswer();
    // 		await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    // 		socket.emit("make-answer", {
    // 		  answer,
    // 		  to: data.socket
    // 		});
    // 	   });
  });

  function call(roomName) {
    console.log("call");
    socket.emit("call-users", {
      roomName,
      uuid: socket.id,
      author,
    });
  }

  return (
    <div className="VideoPanel-Main">
      <div>
        {" "}
        Video chat in <br></br> {roomName}
      </div>
      <div>
        <video
          className="Local-Video"
          ref={videoRef}
          autoPlay
          muted
          id="local-video"
        ></video>
      </div>
      <video
        className="Local-Video"
        ref={visitorVideoRef}
        autoPlay
        muted
        id="visitor-video"
      ></video>
      {/* {Object.entries(peerConnections).map( connection => <div key={connection.socketID}>{connection.author}</div>)} */}

      {/* {peerConnections.map( (user) => <VideoCard key={user.id+user.name} user={user}></VideoCard>)} */}
    </div>
  );
}
