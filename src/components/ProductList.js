import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProductsFromFirestore = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        dispatch(setProducts(productList));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
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

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className='product'>
      <Navbar />

      <h2>Pillock Marketplace</h2>


      <input
        type="text"
        placeholder="Search for a product..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '250px', height: 'auto' }}
              />
            )}
            <h4>{product.description}</h4>
            <p>${product.price}</p>
            {inCart.includes(product.id) ? (
              <span>In Cart</span>
            ) : (
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            )}
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;