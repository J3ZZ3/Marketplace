import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions';
import Navbar from './Navbar';
import CustomerReviews from './CustomerReviews';
import ProductInformation from './ProductInformation';
import RelatedProducts from './RelatedProducts';
import Swal from 'sweetalert2';
import './styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  
  const product = useSelector(state => 
    state.products.items.find(p => p.id === id)
  );
  
  const allProducts = useSelector(state => state.products.items);

  useEffect(() => {
    if (product && allProducts) {
      const similar = allProducts.filter(p => 
        p.category === product.category && p.id !== product.id
      );
      const shuffled = similar.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 4));
    }
  }, [product, allProducts]);

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setIsInCart(savedCartItems.includes(product.id));
  }, [product.id]);

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    savedCartItems.push(product.id);
    localStorage.setItem('cartItems', JSON.stringify(savedCartItems));
    setIsInCart(true);
  };

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        <div className="product-detail-breadcrumb">
          <button onClick={() => navigate('/products')} className="back-button">
            ← Back to Products
          </button>
        </div>
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                loading="lazy"
              />
            ) : (
              <div className="product-image-placeholder">
                No image available
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-price">
              <span className="price-amount">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            <div className="delivery-info">
              <div className="delivery-item">
                <i className="fas fa-truck"></i>
                <span>Eligible for next-day delivery or collection</span>
              </div>
              <div className="delivery-item">
                <i className="fas fa-gift"></i>
                <span>Free Delivery Available</span>
              </div>
              <div className="delivery-item">
                <i className="fas fa-exchange-alt"></i>
                <span>Hassle-Free Exchanges & Returns for 30 Days</span>
              </div>
              <div className="delivery-item">
                <i className="fas fa-shield-alt"></i>
                <span>24-Month Manufacturer Warranty</span>
              </div>
            </div>

            <div className="product-detail-actions">
              <button 
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                disabled={isInCart}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
              <button className="buy-now-btn">
                Buy Now
              </button>
            </div>

            <div className="product-description-section">
              <h2>Product Description</h2>
              <br></br>
              <div className={`description-content ${showFullDescription ? 'expanded' : ''}`}>
                <p>{product.description}</p>
              </div>
              <button 
                className="show-more-btn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        </div>

        <ProductInformation product={product} />
        

        <RelatedProducts 
          products={relatedProducts}
          onAddToCart={(product) => {
            dispatch(addToCart(product));
            Swal.fire({
              icon: 'success',
              title: 'Added to Cart!',
              text: `${product.name} has been added to your cart`,
              timer: 1500,
              showConfirmButton: false
            });
          }}
        />

        <CustomerReviews reviews={product.reviews} productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail; 