import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css'
import happyGif from './bg/topgif.gif';
import catGif from './bg/bottomgif.gif';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Lazy load the background image
    const loadBackgroundImage = async () => {
      try {
        const image = await import('./bg/login.jpg');
        setBackgroundImage(image.default);
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Signing In...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Dispatch login action with user data
      dispatch(loginUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Login successful',
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate('/products');
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
        confirmButtonColor: '#4a90e2'
      });
    }
  };

  return (
    <div className='op' style={{ 
      backgroundImage: backgroundImage 
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
        : 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="login-container">
        <img src={happyGif} alt="Happy sticker" className="happy-gif" />
        <img src={catGif} alt="Shopping cat" className="shopping-cat" />
        <form onSubmit={handleLogin}>
          <center>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '25px',
              fontSize: '28px',
              fontWeight: '600'
            }}>Welcome Back</h2>
          </center>
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
          <button type="submit" className='login-button'>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#2c3e50' }}>
          Don't have an account? <Link className='login-link' to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
