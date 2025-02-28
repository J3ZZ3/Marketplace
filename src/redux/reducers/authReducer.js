import { LOGIN_USER, LOGOUT_USER } from '../actions';

// Check if there's a user session in localStorage
const getInitialUser = () => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

const initialState = {
  user: getInitialUser(),
  loading: true, // Add loading state
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      // Save user to localStorage when logging in
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case LOGOUT_USER:
      // Remove user from localStorage when logging out
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
