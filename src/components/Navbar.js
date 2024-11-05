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
      <h1 className="navbar-logo">Pillock</h1>
      <ul className="navbar-links">
        <li><Link to="/products">Product List</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
