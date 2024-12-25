import React, { useRef, useEffect, useState } from "react";

import "./showDot.css"; // Import CSS for styling
import useDetectionHook from "../mlService.js/poseDetection";

const DOT_COUNT = 1; // Use only a single dot
const MOVEMENT_MULTIPLIER = 3; // Adjust sensitivity for smoother movement

const HeadMovementTracker = () => {
  const { movement, videoRef } = useDetectionHook();

  const [dot, setDot] = useState(() => {
    const centerX = window.innerWidth / 2; // Center X coordinate
    const centerY = window.innerHeight / 3.5; // Center Y coordinate

    // Initialize the dot at the center
    return { x: centerX, y: centerY };
  });

  useEffect(() => {
    // Function to update the dot position smoothly
    const updateDot = () => {
      setDot((prevDot) => {
        const newX = prevDot.x + movement.deltaX * MOVEMENT_MULTIPLIER;
        const newY = prevDot.y + movement.deltaY * MOVEMENT_MULTIPLIER /1.5;

        if (Math.abs(movement.deltaX) > 1 || Math.abs(movement.deltaY) > 1) {
          return { x: newX, y: newY };
        } else {
          return { x: prevDot.x, y: prevDot.y };
        }
      });
    };

    // Use requestAnimationFrame for smoother updates
    const interval = requestAnimationFrame(updateDot);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(interval);
  }, [movement]);

  const resetDot = () => {
    setDot({ x: window.innerWidth / 2, y: window.innerHeight / 3.5 });
    disableMouseEvents();
  };

  const enableMouseEvents = () => {
    window.electron.sendMessage("allow-mouse-events");
  };

  const disableMouseEvents = () => {
    window.electron.sendMessage("reset-ignore-mouse-events");
  };

  return (
    <div className="tracker-container">
      <button
        className="reset-button"
        onClick={resetDot}
        onMouseEnter={enableMouseEvents}
        onMouseLeave={() => disableMouseEvents()}
      >
        Reset
      </button>
      <div className="dot-container">
        <div
          className="dot"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
          }}
        />
      </div>
      <video ref={videoRef} style={{ display: "none" }} playsInline autoPlay muted />
    </div>
  );
};

export default HeadMovementTracker;
