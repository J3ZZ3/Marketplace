import React from 'react';
import './styles/ChatMessage.css';

const ChatMessage = ({ message, isOwnMessage }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-wrapper ${isOwnMessage ? 'own-message' : ''}`}>
      <div className="message">
        {!isOwnMessage && (
          <div className="message-user">
            {message.userPhoto ? (
              <img src={message.userPhoto} alt={message.userName} className="user-avatar" />
            ) : (
              <div className="default-avatar">
                {message.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        <div className="message-content">
          {!isOwnMessage && <span className="message-username">{message.userName}</span>}
          <div className="message-bubble">
            <p>{message.text}</p>
            <span className="message-time">{formatTimestamp(message.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 