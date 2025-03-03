import React from 'react';
import { Link } from 'react-router-dom';
import './styles/MidPagePromotion.css';

const MidPagePromotion = () => {
  // Array of image URLs
  const images = [
    require('../assets/mid.png'), // Replace with your actual image paths
    require('../assets/mid1.png'), // Replace with your actual image paths
    require('../assets/mid2.png'),
    require('../assets/mid3.png'),
    require('../assets/mid4.png'),
  ];

  // Select a random image from the array
  const randomImage = images[Math.floor(Math.random() * images.length)];

  const midPageBanner = {
    image: randomImage,
    link: '/special-offers',
    alt: 'Special Offers'
  };

  return (
    <div className="mid-page-promotion">
      <Link to={midPageBanner.link} className="promo-banner">
        <div className="mid-banner-wrapper">
          <img src={midPageBanner.image} alt={midPageBanner.alt} />
        </div>
      </Link>
    </div>
  );
};

export default MidPagePromotion; 