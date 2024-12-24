import React from "react";
import useDetectionHook from "./mlService.js/poseDetection";

const HeadMovementTracker = () => {
const {distance, movement,videoRef} = useDetectionHook();

  return (
    <div>
      <h1>Head Movement Tracker</h1>
      <p>Distance from origin: {distance.toFixed(2)}</p>
      <p>
        Movement: Δx = {movement.deltaX.toFixed(2)*100}, Δy = {movement.deltaY.toFixed(2)*100}
      </p>
      <video ref={videoRef} style={{ display: "none" }} playsInline autoPlay muted />
    </div>
  );
};

export default HeadMovementTracker;
