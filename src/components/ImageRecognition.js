import React, { Component } from 'react';

import defaultImage from "./jay.jpg";
import * as ml5 from "ml5";

import Navigation from './Navigation'

// ,,l,,
class ImageRecognition extends Component {
  constructor() {
    super();
    this.state = {
      predictions: [],
      image_src: defaultImage,
      file: ''
    }
    this.changeImages = this.changeImages.bind(this);
  }

  setPredictions = (pred) => {
    this.setState({
      predictions: pred
    });
  }

  classifyImg = () => {
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    function modelLoaded() {
      console.log('Model Loaded!');
    }
    const image = document.getElementById('image');
    classifier.predict(image, 5, function (err, results) {
      return results;
    })
      .then((results) => {
        this.setPredictions(results)
      })
  }

  changeImages = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image_src: reader.result
      });
    }

    reader.readAsDataURL(file)
    this.classifyImg()
  }

  componentDidMount() {
    this.classifyImg();
  }

  render() {
    let predictions = (<div className="loader"></div>);
    if (this.state.predictions.length > 0) {
      predictions = this.state.predictions.map((pred, i) => {
        let { label, confidence } = pred;
        confidence = Math.floor(confidence * 10000) / 100 + "%";
        return (
          <div key={i + ""}>{i + 1}. Prediction: { label} at { confidence} </div>
        )
      })
    }

    return (
      <div>
        <Navigation />
        <div className="App">
          <h1>Image Classification</h1>
          <input className="fileInput"
            type="file"
            onChange={(e) => this.changeImages(e)} />
          <img className="image" onClick={(e) => this.changeImages(e)} src={this.state.image_src} id="image" width="400" alt="" />
          {predictions}
        </div>
      </div>
    );
  }
}

export default ImageRecognition;