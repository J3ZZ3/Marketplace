import React from 'react';
import './styles/CallToActionSection.css'; // Create a separate CSS file for styling

const CallToActionSection = ({ onGetStarted }) => {
  return (
    <div className="cta-section">
      <h2>Join Us Today!</h2>
      <p>Sign up now and get exclusive discounts!</p>
      <button onClick={onGetStarted} className="cta-btn">Sign Up</button>
    </div>
  );
};

export default CallToActionSection; 