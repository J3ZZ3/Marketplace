// Navbar.js

import React from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // assuming you have configured firebase in a separate file
import './styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out from Firebase authentication
      localStorage.removeItem('loggedInUser'); // Clear user data from localStorage
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">Pillock</Link>
          <div className="search-bar">
            <input type="text" placeholder="Search products..." />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="nav-actions">
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="navbar-bottom">
        <div className="navbar-container">
          <ul className="navbar-links">
            <li><Link to="/products">Shop by Department</Link></li>
            <li><Link to="/deals">Daily Deals</Link></li>
            <li><Link to="/new">New Arrivals</Link></li>
            <li><Link to="/featured">Featured Brands</Link></li>
            <li><Link to="/dashboard">Seller Dashboard</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
