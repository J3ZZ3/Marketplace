import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './styles/ProductList.css';
import Navbar from './Navbar';

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
    <div className="pl-product-list">
      <h2 className="pl-product-list-title">Pillock Marketplace</h2>
      
      <input
        type="text"
        className="pl-search-bar"
        placeholder="Search for a product..."
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="pl-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="pl-product-card">
              <h3 className="pl-product-name">{product.name}</h3>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="pl-product-image"
                />
              )}
              <p className="pl-product-description">{product.description}</p>
              <p className="pl-product-price">${product.price}</p>
              {inCart.includes(product.id) ? (
                <span className="in-cart">In Cart</span>
              ) : (
                <button className="pl-add-to-cart-button" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="pl-no-products">No products available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ProductList;
