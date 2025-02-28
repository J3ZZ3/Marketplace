import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const AdComponent = ({ client, slot, format }) => {
  useEffect(() => {
    // Load Google AdSense script
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    // Initialize ads
    const initializeAds = () => {
      try {
        // Wait for script to load before initializing
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          setTimeout(initializeAds, 50); // Retry if script hasn't loaded yet
        }
      } catch (error) {
        console.error('Ad initialization error:', error);
      }
    };

    // Only load script if it hasn't been loaded yet
    if (!document.querySelector(`script[src*="adsbygoogle"]`)) {
      loadAdScript();
    }

    // Delay ad initialization to ensure script is loaded
    setTimeout(initializeAds, 100);

    // Cleanup
    return () => {
      // It's better not to remove the script as it might affect other ad instances
      // The cleanup is optional and can be removed if causing issues
    };
  }, [client]);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'block',
        width: format === 'skyscraper' ? '160px' : '100%',
        height: format === 'skyscraper' ? '600px' : 'auto',
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="false"
    />
  );
};

AdComponent.propTypes = {
  client: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
};

export default AdComponent; 