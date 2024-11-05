import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/LandingPage";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import Payment from "./components/Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} /> {}
      </Routes>
    </Router>
  );
}

export default App;
