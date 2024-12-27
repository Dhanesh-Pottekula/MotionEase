import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

let detector;

onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === "initialize") {
    await tf.setBackend("webgl");
    await tf.ready();
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        runtime: "tfjs",
        modelType: "SinglePose.Lightning",
      }
    );
    postMessage({ type: "initialized" });
  } else if (type === "detect") {
    const { imageBitmap } = payload;

    // Convert ImageData to a tensor
    const inputTensor = tf.browser.fromPixels(imageBitmap);
if(!detector) return {}
    const poses = await detector.estimatePoses(inputTensor);

    if (Array.isArray(poses)&&poses.length > 0) {
      const nose = poses[0].keypoints.find(
        (keypoint) => keypoint.name === "nose"
      );

      if (nose && nose.score > 0.5) {
        postMessage({
          type: "movement",
          payload: { x: nose.x, y: nose.y },
        });
      }
    }

    tf.dispose(inputTensor); // Clean up tensor
  }
};
