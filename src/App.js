import React, { useRef, useEffect, useState } from "react";
import useDetectionHook from "./mlService.js/poseDetection";
import "./App.css"; // Import CSS for styling

const DOT_COUNT = 5; // Number of dots in the animation
const MOVEMENT_MULTIPLIER = 3; // Adjust sensitivity

const HeadMovementTracker = () => {
  const { distance, movement, videoRef } = useDetectionHook();
  const [dots, setDots] = useState(() => {
    const centerX = window.innerWidth / 2; // Center X coordinate
    const centerY = window.innerHeight / 3.5; // Center Y coordinate
    return Array.from({ length: DOT_COUNT }, () => ({ x: centerX, y: centerY }));
  });
  

  useEffect(() => {
    // Update dots' positions based on movement
    setDots((prevDots) => {
      const newDots = [...prevDots];
      for (let i = newDots.length - 1; i > 0; i--) {
        // Shift dots to follow the leader
        newDots[i] = { ...newDots[i - 1] };
      }
      // Leader dot reacts to movement
      const leaderX = newDots[0].x + movement.deltaX * MOVEMENT_MULTIPLIER;
      const leaderY = newDots[0].y + movement.deltaY * MOVEMENT_MULTIPLIER;
      newDots[0] = { x: leaderX, y: leaderY };

      return newDots;
    });
  }, [movement]);

  return (
    <div className="tracker-container">
      <h1>Head Movement Tracker</h1>
      <p>Distance from origin: {distance.toFixed(2)}</p>
      <p>
        Movement: Δx = {(movement.deltaX * 100).toFixed(2)}, Δy = {(movement.deltaY * 100).toFixed(2)}
      </p>
      <div className="dot-container">
        {dots.map((dot, index) => (
          <div
            key={index}
            className="dot"
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              opacity: 1 - index / DOT_COUNT, // Fade out the trail
            }}
          />
        ))}
      </div>
      <video ref={videoRef} style={{ display: "none" }} playsInline autoPlay muted />
    </div>
  );
};

export default HeadMovementTracker;
