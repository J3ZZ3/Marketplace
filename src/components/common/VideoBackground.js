import React from 'react';
import PropTypes from 'prop-types';

const VideoBackground = ({ 
  videoSource, 
  fallbackImage, 
  overlayOpacity = 0.6,
  objectFit = 'cover',
  priority = false 
}) => {
  return (
    <div className="video-background-wrapper">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="video-background"
        preload={priority ? "auto" : "metadata"}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {fallbackImage && (
        <div 
          className="fallback-image" 
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      <div 
        className="video-overlay" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />
      <style jsx>{`
        .video-background-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .video-background {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          object-fit: ${objectFit};
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .fallback-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .video-background {
            display: none;
          }
          .fallback-image {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .video-background {
            object-fit: cover;
          }
        }
      `}</style>
    </div>
  );
};

VideoBackground.propTypes = {
  videoSource: PropTypes.string.isRequired,
  fallbackImage: PropTypes.string,
  overlayOpacity: PropTypes.number,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill']),
  priority: PropTypes.bool
};

export default VideoBackground; 