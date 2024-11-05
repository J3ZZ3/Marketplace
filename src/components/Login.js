import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css'


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in:', userCredential.user);
      navigate('/products');
    } catch (error) {
      setError(error.message);
    }
  };

  return (<div className='op'>
    <div className="login-container">
      <form onSubmit={handleLogin} >
      <center><h2>Login</h2></center>
      <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='login-button'>Login</button>
        {error && <p className='login-error'>{error}</p>}
      </form>
      <p >
        Don't have an account? <Link className='login-link' to="/register">Sign up</Link>
      </p>
    </div>
    </div>
  );
}

export default Login;
