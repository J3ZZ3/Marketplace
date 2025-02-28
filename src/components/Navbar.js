// Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // assuming you have configured firebase in a separate file
import './styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out from Firebase authentication
      localStorage.removeItem('loggedInUser'); // Clear user data from localStorage
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Pillock</Link>
      <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Product List</Link></li>
        <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
