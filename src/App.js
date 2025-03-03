import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/LandingPage";
import AddProduct from "./components/AddProduct";
import ManageProducts from "./components/Dashboard";
import ProductList from "./components/ProductList";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
