import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered:', userCredential.user);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (<div className='app'>
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
      <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="register-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-button">Sign Up</button>
        {error && <p className="register-error">{error}</p>}
      </form>
      <p>
        Already have an account? 
        <Link to="/login" className="register-link"> Sign in</Link>
      </p>
    </div>
    
    </div>

  );
}

export default Register;
