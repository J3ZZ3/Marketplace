import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Register.css';
import happyGif from './bg/topgif.gif';
import catGif from './bg/bottomgif.gif';
import Swal from 'sweetalert2';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const image = await import('./bg/signup.jpg');
        setBackgroundImage(image.default);
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password should be at least 6 characters long',
        confirmButtonColor: '#4a90e2'
      });
      return;
    }

    // Show loading indicator
    Swal.fire({
      title: 'Creating Account...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered:', userCredential.user);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Account created successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate('/login');
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
        confirmButtonColor: '#4a90e2'
      });
    }
  };

  return (
    <div className='op' style={{ 
      background: backgroundImage 
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
        : 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="register-container">
        <img src={happyGif} alt="Happy sticker" className="happy-gif" />
        <img src={catGif} alt="Shopping cat" className="shopping-cat" />
        <form onSubmit={handleRegister}>
          <center>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '25px',
              fontSize: '28px',
              fontWeight: '600'
            }}>Create Account</h2>
          </center>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#2c3e50' }}>
          Already have an account? <Link className="register-link" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
