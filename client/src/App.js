import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatFeed from './ChatFeed';

class App extends Component {
  render() {
    return (
      <div className="container">
      <div className="join-screen col-md-10 col-md-offset-1 col-sm-12">
        <div className="jumbotron">
          <h3>Anonymous Chat application using ReactJS, NodeJs and SocketIo</h3>
          <p>Click on 'Join' to join the Chatroom as a guest.</p>
          <ChatFeed />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
