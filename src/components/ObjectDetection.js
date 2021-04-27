// Load react to the document file
import React from "react";
//Load the coco-ssd model. This model detects objects defined in the COCO dataset, which is a large-scale object detection, segmentation, and captioning dataset. The model is capable of detecting 80 classes of objects. (SSD stands for Single Shot MultiBox Detection).
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Navigation from './Navigation'

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      stream: ""
    }
  }
  // Create reference for video and canvas. This is to be able to manipulate the video and the canvas which is responsible for showing the information from the webcam to the webpage.
  videoRef = React.createRef();
  canvasRef = React.createRef();

  //componentDidMount is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request. In this case, we use this lifecycle to load the webcam and start the stream. Also this is where we detect the media device whether it's capable of capturing video through webcam or smartphone camera. 
  componentDidMount() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("This browser does not support the API yet");
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        })
        .then(stream => {
          window.stream = stream;
          this.setState({
            stream: window.stream
          });
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        })
        .catch((e) => {
          this.detectFrame = () => { };
          return
        });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  //componentWillUnmount() is invoked immediately before a component is unmounted and destroyed. We perform this lifecycle for cleaning up any subscriptions that were created in componentDidMount(). In this case, we need to destroy the detectFrame so it doesn't run all the time.
  componentWillUnmount() {
    this.detectFrame = () => { }
    if (this.state.stream) this.state.stream.getTracks()[0].stop();
  }

  // This function is responsible for making predictions based on what the webcam/camera is seeing. It compares it to the coco-ssd model to make predictions.
  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };

  // This function creates a box to the detected object and show the prediction based on the model.
  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "tomato";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "tomato";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#fff";
      ctx.fillText(prediction.class, x, y);
    });
  };

  render() {
    return (
      <div>
        <Navigation></Navigation>
        <div className="objectDetection">
          <h1>Object Detection</h1>
          <h5>Only works in Google Chrome</h5>
          <video
            className="size"
            autoPlay
            playsInline
            muted
            ref={this.videoRef}
            width="600"
            height="500"
          />
          <canvas
            className="size"
            ref={this.canvasRef}
            width="600"
            height="500"
          />
        </div>
      </div>
    );
  }
}

export default Home;