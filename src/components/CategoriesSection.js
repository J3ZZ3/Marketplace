import React from 'react';
import { FaLaptop, FaTshirt, FaHome, FaFutbol } from 'react-icons/fa';
import './styles/CategoriesSection.css'; // Create a separate CSS file for styling

const CategoriesSection = () => {
  return (
    <div className="categories-section">
      <h2>Shop by Category</h2>
      <div className="categories">
        <div className="category">
          <FaLaptop className="category-icon" />
          <h3>Electronics</h3>
        </div>
        <div className="category">
          <FaTshirt className="category-icon" />
          <h3>Fashion</h3>
        </div>
        <div className="category">
          <FaHome className="category-icon" />
          <h3>Home & Garden</h3>
        </div>
        <div className="category">
          <FaFutbol className="category-icon" />
          <h3>Sports</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection; 