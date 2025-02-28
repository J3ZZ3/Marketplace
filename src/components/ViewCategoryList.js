import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import Swal from 'sweetalert2';
import './styles/ViewCategoryList.css';

const ViewCategoryList = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [inCart, setInCart] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef, 
          where('category', '==', category.charAt(0).toUpperCase() + category.slice(1))
        );
        const snapshot = await getDocs(q);
        
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setInCart((prevInCart) => [...prevInCart, product.id]);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    
    const sortedProducts = [...products];
    switch (sortValue) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  return (
    <div>
      <Navbar />
      <div className="category-list-container">
        <div className="category-header">
          <h1 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)} Products
          </h1>
          <div className="sort-container">
            <select 
              value={sortBy} 
              onChange={handleSort}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <h2>No products found in this category</h2>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isInCart={inCart.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategoryList; 