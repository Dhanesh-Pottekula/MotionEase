import React, { useRef, useEffect, useState } from "react";

function useDetectionHook() {
  const videoRef = useRef(null);
  const [movement, setMovement] = useState({ deltaX: 0, deltaY: 0 });

  const previousPosition = useRef({ x: null, y: null });
  const workerRef = useRef(null);

  const setupCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;

    return new Promise((resolve) => {
      videoRef.current.onloadedmetadata = () => resolve();
    });
  };

  useEffect(() => {
    workerRef.current = new Worker(new URL("./poseWorker.js", import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "initialized") {
        console.log("Worker initialized");
      } else if (type === "movement") {
        const { x, y } = payload;

        if (
          previousPosition.current.x !== null &&
          previousPosition.current.y !== null
        ) {
          const deltaX = x - previousPosition.current.x;
          const deltaY = y - previousPosition.current.y;
          setMovement({ deltaX, deltaY });
        }

        previousPosition.current = { x, y };
      }
    };

    const initialize = async () => {
      await setupCamera();
      videoRef.current.play();

      workerRef.current.postMessage({
        type: "initialize",
      });

      const video = videoRef.current;
    const track = video.captureStream().getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
      const detect = async () => {
          const imageBitmap = await imageCapture.grabFrame();
          workerRef.current.postMessage(
            {
              type: "detect",
              payload: { imageBitmap },
            },
            [imageBitmap] 
          );

        requestAnimationFrame(detect);
      };

      detect();
    };

    initialize();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return {
    movement,
    videoRef,
  };
}

export default useDetectionHook;
