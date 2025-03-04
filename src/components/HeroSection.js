import React from 'react';
import './styles/HeroSection.css'; // Create a separate CSS file for styling

const HeroSection = ({ onGetStarted }) => {
  return (
    <div className="hero-section">
      <div className="overlay">
        <h1>Welcome to Pillock Marketplace</h1>
        <p>Discover amazing products at unbeatable prices!</p>
        <button onClick={onGetStarted} className="get-started-btn">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection; 