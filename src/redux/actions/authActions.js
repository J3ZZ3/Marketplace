import { auth, firebase } from '../../firebase/firebaseConfig';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types';

// Login action
export const login = (email, password) => async dispatch => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: userCredential.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

// Logout action
export const logout = () => async dispatch => {
  await auth.signOut();
  dispatch({ type: LOGOUT });
};
