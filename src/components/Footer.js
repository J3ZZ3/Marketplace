import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Newsletter Subscription */}
        <div className="newsletter-section">
          <h3>Subscribe to our Newsletter</h3>
          <p>Stay updated with our latest deals and products</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address"
              aria-label="Email subscription"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Help Center</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/about">About Pillock</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press Releases</Link></li>
              <li><Link to="/competition">Competition</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Payment Methods</h4>
            <ul>
              <li><Link to="/payment">Credit Card</Link></li>
              <li><Link to="/payment">Debit Card</Link></li>
              <li><Link to="/payment">EFT</Link></li>
              <li><Link to="/payment">Instant EFT</Link></li>
              <li><Link to="/payment">Cash on Delivery</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Connect with Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-info">
            <p>&copy; 2024 Pillock. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
