import React from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
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
