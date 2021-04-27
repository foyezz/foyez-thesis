import React, { Component } from 'react';
import defaultImage from "./ml.jpg";

import Navigation from './Navigation'


class Home extends Component {

  render() {

    return (
      <>
        <Navigation />
        <div id="imgWrapper">
          <img id="homeImage" src={defaultImage} />
        </div>

      </>
    );
  }
}

export default Home;