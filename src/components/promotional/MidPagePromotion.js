import React from 'react';
import { Link } from 'react-router-dom';
import './styles/MidPagePromotion.css';

const MidPagePromotion = () => {
  const midPageBanner = {
    image: require('../assets/mid.png'),
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