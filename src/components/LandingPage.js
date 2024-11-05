import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/products");
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="overlay">
          <h1>Pillock Marketplace</h1>
          <p>
            The place you go to when you want to look rich when you're poor{" "}
          </p>
          <button onClick={handleGetStarted} className="get-started-btn">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;