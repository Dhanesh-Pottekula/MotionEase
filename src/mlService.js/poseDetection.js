import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl"; // Ensure the WebGL backend is included
function useDetectionHook() {
  const videoRef = useRef(null);
  const [movement, setMovement] = useState({ deltaX: 0, deltaY: 0 });

  const previousPosition = useRef({ x: null, y: null });

  const setupCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;

    return new Promise((resolve) => {
      videoRef.current.onloadedmetadata = () => resolve();
    });
  };

  const calculateHeadMetrics = (noseKeypoint) => {
    const { x, y } = noseKeypoint;

    // Calculate movement (deltaX, deltaY)
    if (
      previousPosition.current.x !== null &&
      previousPosition.current.y !== null
    ) {
      const deltaX = x - previousPosition.current.x;
      const deltaY = y - previousPosition.current.y;
      setMovement({ deltaX, deltaY });
    }

    // Update previous position
    previousPosition.current = { x, y };
  };

  const runPoseDetection = async () => {
    await tf.ready();

    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        runtime: "tfjs",
        modelType: "SinglePose.Lightning",
      }
    );

    const video = videoRef.current;

    const detect = async () => {
      const poses = await detector.estimatePoses(video);

      if (poses.length > 0) {
        const nose = poses[0].keypoints.find(
          (keypoint) => keypoint.name === "nose"
        );
        if (nose && nose.score > 0.5) {
          calculateHeadMetrics(nose);
        }
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  useEffect(() => {
    const initialize = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      await setupCamera();
      videoRef.current.play();
      runPoseDetection();
    };

    initialize();
  }, []);
  return {
    movement,
    videoRef,
  };
}

export default useDetectionHook;
