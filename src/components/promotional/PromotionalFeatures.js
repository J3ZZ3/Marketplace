import React from 'react';
import './styles/PromotionalFeatures.css';

const PromotionalFeatures = () => {
  const features = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over $100",
      icon: "🚚"
    },
    {
      id: 2,
      title: "Special Discount",
      description: "Save 10% on first order",
      icon: "🏷️"
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Always here to help",
      icon: "💬"
    }
  ];

  return (
    <div className="promotional-features">
      {features.map((promo) => (
        <div key={promo.id} className="promo-card">
          <span className="promo-icon">{promo.icon}</span>
          <h3>{promo.title}</h3>
          <p>{promo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PromotionalFeatures; 