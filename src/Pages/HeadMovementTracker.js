import React, { useRef, useEffect, useState } from "react";

import "./showDot.css"; // Import CSS for styling
import useDetectionHook from "../mlService.js/poseDetection";

const DOT_COUNT = 2; // Number of dots in the animation
const MOVEMENT_MULTIPLIER = 3; // Adjust sensitivity for smoother movement

const HeadMovementTracker = () => {
  const {  movement, videoRef } = useDetectionHook();

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
    // Function to update dot positions smoothly
    const updateDots = () => {
      setDots((prevDots) => {
        const newDots = prevDots.map((dot, index) => {
          // For the first dot (leader), update based on movement
          if (index === 0) {
            const leaderX = dot.x + movement.deltaX * MOVEMENT_MULTIPLIER;
            const leaderY = dot.y + movement.deltaY * MOVEMENT_MULTIPLIER*1.5;
            if(Math.abs(movement.deltaX)>1|| Math.abs(movement.deltaY )>1) {
              return { x: leaderX, y: leaderY };
            }else{
              return { x: dot.x, y: dot.y };
            }
          } else {
            // For other dots, each dot follows the previous one with smoothing
            const prevDot = prevDots[index - 1];
            const newX = prevDot.x + (dot.x - prevDot.x) * 0.5; // Smaller factor for smoother following
            const newY = prevDot.y + (dot.y - prevDot.y) * 0.5; // Smaller factor for smoother following
            return { x: newX, y: newY };
          }
        });

        return newDots;
      });
    };

    // Use requestAnimationFrame for smoother updates
    const interval = requestAnimationFrame(updateDots);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(interval);
  }, [movement]);

  return (
    <div className="tracker-container">
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
