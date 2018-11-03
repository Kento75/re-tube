import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import firebase from 'firebase/app';
import config from '../config/firebase-config';
import Header from './Header';
import VideoUpload from './VideoUpload';
import VideoFeed from "./VideoFeed";

class App extends Component {
  constructor() {
    super();

    // Initialize Firebase
    firebase.initializeApp(config);
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route path="/" component={VideoFeed} />
            <Route path="/upload" component={VideoUpload} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;