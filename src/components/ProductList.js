import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './styles/ProductList.css';
import Navbar from './Navbar';
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [inCart, setInCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProductsFromFirestore = async () => {
      try {
        Swal.fire({
          title: 'Loading Products...',
          html: 'Please wait while we load the products.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        dispatch(setProducts(productList));
      } catch (error) {
        console.error("Error fetching products: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load products. Please try again.',
        });
      } finally {
        Swal.close();
      }
    };

    fetchProductsFromFirestore();
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setInCart((prevInCart) => [...prevInCart, product.id]);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div>
      <Navbar />
      <div className="product-list">
        <h2 className="product-list-title">Pillock Marketplace</h2>
        
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isInCart={inCart.includes(product.id)}
              />
            ))
          ) : (
            <p className="no-products">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
