import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import { tokenUrl, instanceLocator } from './config';

import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import NewRoomForm from './components/NewRoomForm';

import './App.css';

class App extends Component {

  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: []
  }

  componentDidMount = () => {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'f4p',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(err => console.log('error on connecting: ', err))
  }

  getRooms = () => {
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => console.log('error on joinableRooms: ', err))
  }

  subscribeToRoom = (roomId) => {
    this.setState({ messages: [] })
    this.currentUser.subscribeToRoom({
      roomId,
      messageLimit: 20,
      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages, message],
          })
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      })
      this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room'))
  }

  sendMessage = (text) => {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  createRoom = (name) => {
    this.currentUser.createRoom({
      name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="app">
        <RoomList
            roomId={this.state.roomId}
            subscribeToRoom={this.subscribeToRoom}
            rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <MessageList
            roomId={this.state.roomId}
            messages={this.state.messages} />
        <SendMessageForm
            disabled={!this.state.roomId}
            sendMessage={this.sendMessage} />
        <NewRoomForm
            createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
