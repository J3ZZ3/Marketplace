import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { loginUser, logoutUser } from './redux/actions';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/LandingPage";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import ViewCategoryList from './components/ViewCategoryList';
import EditProduct from './components/EditProduct';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(loginUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        // User is signed out
        dispatch(logoutUser());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/add-product" element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/edit-product/:id" element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        } />
        <Route path="/category/:category" element={<ViewCategoryList />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
