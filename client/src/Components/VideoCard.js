import React from "react";
import "./VideoCard.css";

export default function VideoCard({ user }) {
  // const videoRef = useRef(null);

  //   useEffect( () => {
  // 	navigator.getUserMedia(
  // 		{ video: true, audio: true },
  // 		stream => {
  // 		//   const localVideo = document.getElementById("local-video");
  // 		//   if (localVideo) {
  // 			videoRef.current.srcObject = stream;
  // 		//   }

  // 		//   stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  // 		},
  // 		error => {
  // 		console.warn(error.message);
  // 		}
  // 	);

  // },[])
  return (
    <div>
      <video className="Video" autoPlay muted id="local-video"></video>
      {user.name}
    </div>
  );
}
