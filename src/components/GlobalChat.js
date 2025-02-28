import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { rtdb } from '../firebase';
import { useSelector } from 'react-redux';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import './styles/GlobalChat.css';

const GlobalChat = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const user = useSelector(state => state.auth.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messagesRef = ref(rtdb, 'globalChat');
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((childSnapshot) => {
        messagesData.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      // Sort messages by timestamp
      messagesData.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => {
      // Detach the listener
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !user) return;

    try {
      const messagesRef = ref(rtdb, 'globalChat');
      await push(messagesRef, {
        text: messageText,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || null,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="global-chat-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="chat-header-info">
            <h2>Global Chat</h2>
            <p>Connect with other users</p>
          </div>
        </div>
        
        <div className="messages-container">
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.userId === user?.uid}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default GlobalChat; 