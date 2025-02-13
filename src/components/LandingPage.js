import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './styles/LandingPage.css';
import fallbackImage from './bg/Premium_.jfif';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Lazy load the video
    const loadVideo = async () => {
      try {
        const videoModule = await import('./bg/video.mp4');
        setVideoSource(videoModule.default);
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();

    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="homepage">
      {/* Fallback background while video loads */}
      {!isVideoLoaded && (
        <div 
          className="fallback-background"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${fallbackImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: -2
          }}
        />
      )}

      {videoSource && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleVideoLoad}
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: isVideoLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
          // Performance optimizations
          preload="auto"
          poster={fallbackImage}
        >
          <source 
            src={videoSource} 
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="hero-section">
        <div className="overlay">
          <h1>Pillock Marketplace</h1>
          <p>
            The place you go to when you want to look rich when you're poor{" "}
          </p>
          <button 
            onClick={handleGetStarted} 
            className="get-started-btn"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;