import React, { useRef, useEffect, useState } from "react";
import useDetectionHook from "./mlService.js/poseDetection";
import "./App.css"; // Import CSS for styling

const DOT_COUNT = 5; // Number of dots in the animation
const MOVEMENT_MULTIPLIER = 3; // Adjust sensitivity
const RANDOM_OFFSET = 100; // Random offset for dot positions

const HeadMovementTracker = () => {
  const { distance, movement, videoRef } = useDetectionHook();

  const [dots, setDots] = useState(() => {
    const centerX = window.innerWidth / 2; // Center X coordinate
    const centerY = window.innerHeight / 3.5; // Center Y coordinate

    // Create dots with random offsets around the center
    return Array.from({ length: DOT_COUNT }, () => ({
      x: centerX , // Randomize X
      y: centerY , // Randomize Y
    }));
  });

  useEffect(() => {
    // Update dots' positions based on movement
    setDots((prevDots) => {
      const newDots = prevDots.map((dot, index) => {
        // For the first dot (leader), update based on movement
        if (index === 0) {
          const leaderX = dot.x + movement.deltaX * MOVEMENT_MULTIPLIER;
          const leaderY = dot.y + movement.deltaY * MOVEMENT_MULTIPLIER;
          return { x: leaderX, y: leaderY };
        } else {
          // For other dots, each dot follows the previous one
          const prevDot = prevDots[index - 1];
          const newX = prevDot.x + (dot.x - prevDot.x) * 0.6; // Move closer to the previous dot
          const newY = prevDot.y + (dot.y - prevDot.y) * 0.6; // Move closer to the previous dot
          return { x: newX, y: newY };
        }
      });

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
