import React, { useEffect, useState } from 'react';

const CustomAdComponent = ({ position }) => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`your-ad-api-url/ads/${position}`);
        const data = await response.json();
        setAd(data);
      } catch (error) {
        console.error('Error fetching ad:', error);
      }
    };

    fetchAd();
  }, [position]);

  if (!ad) return null;

  return (
    <div className="custom-ad">
      <a href={ad.link} target="_blank" rel="noopener noreferrer">
        <img src={ad.imageUrl} alt={ad.title} />
      </a>
    </div>
  );
};

export default CustomAdComponent; 