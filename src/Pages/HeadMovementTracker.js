import React, { useRef, useEffect, useState } from "react";

import "./showDot.css"; // Import CSS for styling
import useDetectionHook from "../mlService.js/poseDetection";

const DOT_COUNT = 1; // Number of dots in the animation
const MOVEMENT_MULTIPLIER = 3; // Adjust sensitivity for smoother movement

const HeadMovementTracker = () => {
  const initialPositions = [
    // Top-left corner (closer to the center)
    { x: window.innerWidth * 0.3, y: window.innerHeight * 0.2 },
    // Top-right corner (closer to the center)
    { x: window.innerWidth * 0.70, y: window.innerHeight * 0.2 },
    // Bottom-right corner (closer to the center)
    { x: window.innerWidth * 0.70, y: window.innerHeight * 0.8 },
    // Bottom-left corner (closer to the center)
    { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 },
  
    // (top-left)
    { x:window.innerWidth * 0.1, y: window.innerHeight*0.08 },
    //left middle
    { x:window.innerWidth * 0.1, y: window.innerHeight*0.5 },
    // top-right
    //  bottom-left)
    { x: window.innerWidth * 0.1, y: window.innerHeight*0.9  },
    { x: window.innerWidth*0.9, y:window.innerHeight*0.08  },
    // middle-left
    { x: window.innerWidth*0.9 , y: window.innerHeight*0.5 },
    // bottom-left
    { x: window.innerWidth*0.9 , y: window.innerHeight*0.9 },
    // Center (exact middle)
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },


  ];
  
  const { movement, videoRef } = useDetectionHook();


  const [dots, setDots] = useState(initialPositions);

  useEffect(() => {
    const updateDots = () => {
      setDots((prevDots) => {
        return prevDots.map((dot) => {
          const newX = dot.x + movement.deltaX * MOVEMENT_MULTIPLIER;
          const newY = dot.y + movement.deltaY * MOVEMENT_MULTIPLIER / 1.5;

          return { x: newX, y: newY };
        });
      });
    };

    // Start the animation loop
    let animationFrameId = requestAnimationFrame(updateDots);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [movement]);
  const resetDots = () => {
    setDots(initialPositions);
    disableMouseEvents();
  };
  const enableMouseEvents = () => {
    window?.electron?.sendMessage("allow-mouse-events");
  };
  const disableMouseEvents =()=>{
    window?.electron?.sendMessage("reset-ignore-mouse-events")
  }
  return (
    <div className="tracker-container">
      <button
        className="reset-button"
        onClick={resetDots}
        onMouseEnter={enableMouseEvents}
        onMouseLeave={() =>
          disableMouseEvents()
        }
      >
        Reset
      </button>
      <div className="dot-container">
        {dots.map((dot, index) => (
          <div
            key={index}
            className="dot"
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
            }}
          />
        ))}
      </div>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        autoPlay
        muted
      />
    </div>
  );
};

export default HeadMovementTracker;
