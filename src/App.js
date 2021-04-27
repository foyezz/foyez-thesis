import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import './App.css';

import Home from './components/Home'
import ObjectDetection from './components/ObjectDetection'
import ImageRecognition from './components/ImageRecognition'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/object_detection" component={ObjectDetection} />
          <Route path="/image_recognition" component={ImageRecognition}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;