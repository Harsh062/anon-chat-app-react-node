import React, { Component } from 'react';
import io from 'socket.io-client';

class ChatFeed extends Component {
    constructor(props) {
        super(props);
        // IP Address & port for chat server running node app. 
        const chatServerAddress = "http://localhost:5000";
        this.state = { 
            messages: [],
            socket: io(chatServerAddress),
            joined: false,
            isMessageEmpty: true,
            updates: { 
              message: null 
            }
         };
      }

      componentDidMount(){
        var self = this;
    
        // Add new messages from server (sended by client's app)
        this.state.socket.on("user:message", function(msg){
          var messages = self.state.messages
          messages.push(msg);
          self.setState({
            messages: messages
          });
        });

        // Interaction with UI when the server detects that a user left the chat channel
        this.state.socket.on("user:leave", function(msg){
        var messages = self.state.messages
        messages.push(msg);
        self.setState({
          messages: messages,
          updates: { message: "The interaction with chat feed is not available" }
        });
      });
  
        // A user joined into chat
        this.state.socket.on("user:join", function(msg,color){
        var messages = self.state.messages
        messages.push(msg);
        self.setState({
          messages: messages, 
          updates: { message: null }
        });
      });
  
      // Interaction with UI when the server detects that a user is typing a message
      this.state.socket.on("user:typing", function(msg){
        self.setState({
          updates: msg
        });
        
        setTimeout(function(){
          self.setState({
            updates: { message: null }
          });
        }.bind(self),2000);  // wait then reset updates
  
      });
    }

    componentDidUpdate() {
        // When user join focus in message input
        if (this.state.joined) {
          this.refs.msgInput.focus()
        }
      }

      submitMessage = () => {
        var message = document.getElementById("msg");
    
        if(message.value !== "") {
          this.state.socket.emit("user-message", 
            { 
              message: message.value,
              color: localStorage.getItem('color') 
            }
          );
          message.value = "";
          this.setState({
            isMessageEmpty: true
          });
        }
      }

      joinChatFeed = () => {
        // Generate a random color for indetify users
        var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    
        // Save color in Browser localStorage
        localStorage.setItem('color', color);
    
        this.state.socket.emit("user-join", color);
    
        this.setState({
          joined: true,
        });
    
      }

      // Action in client app when a user left the chat channel
  leaveChatFeed = () => {
    this.state.socket.emit("user-leave", localStorage.getItem('color'));

    this.setState({
      joined: false,
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitMessage();
    } else {
      var isEmpty = true;
      if(e.target.value !== ""){
        isEmpty = false;
      }
      this.setState({
        isMessageEmpty: isEmpty
      });

      var color = localStorage.getItem('color');
      this.state.socket.emit("user-typing", color);
    }
}

render(){
    
        var self = this;
        // Take color for auxiliary messages
        var updateColor = {
          color: this.state.updates.color
        }
    
        // Make a list of message for render
        var messages = this.state.messages.map(function(msg){
          var msgStyle = {
            color: msg.color
          }
          return <li style={msgStyle}> ({msg.time}) {msg.message} </li>
        });
        
        return(
          <div className="component">
            <div className="join">
              <button className="btn btn-primary btn-lg" disabled={this.state.joined} onClick={() => this.joinChatFeed()}>Join</button>
            </div>
            <div id="feed">
              <ul id="msgs" className="list-unstyled">
                {messages}
              </ul>
            </div>
            <div className="updates">
              <span style={updateColor} class='text-muted'>{this.state.updates.message}</span>
            </div>
            <div className="form-inline">
              <div className="form-group">
                <input id="msg" ref="msgInput" className="form-control input-lg" type="text" placeholder="Your message" disabled={!this.state.joined} onKeyPress={this.handleKeyPress}/>
              </div>
              <button className="btn btn-success btn-lg" disabled={this.state.isMessageEmpty} onClick={() => this.submitMessage()}>Send</button>
              <button className="btn btn-danger btn-lg" disabled={!this.state.joined} onClick={() => this.leaveChatFeed()}>Leave</button>
            </div>
          </div>
        )
      }
}

export default ChatFeed;