import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './styles/ProductList.css';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import HeroBanner from './promotional/HeroBanner';
import PromotionalFeatures from './promotional/PromotionalFeatures';
import MidPagePromotion from './promotional/MidPagePromotion';
import { Link } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import AdComponent from './ads/AdComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [inCart, setInCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorizedProducts, setCategorizedProducts] = useState({});

  const sidePromotions = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over $50",
      icon: "🚚"
    },
    {
      id: 2,
      title: "Special Discount",
      description: "Save 10% on first order",
      icon: "🏷️"
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Always here to help",
      icon: "💬"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const productList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt || new Date().toISOString()
          };
        });

        // Categorize products
        const categorized = productList.reduce((acc, product) => {
          const category = product.category || 'Other';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        setCategorizedProducts(categorized);
        dispatch(setProducts(productList));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterProducts = (products) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery)
    );
  };

  return (
    <div>
      <Navbar />
      <div className="product-container">
        {/* Left Side Ad */}
        <div className="side-ad">
          <AdComponent 
            slot="left-sidebar"
            format="skyscraper"
            client="pub-5967916725112674"
          />
        </div>

        {/* Main Content */}
        <div className="main-content">
          <HeroBanner />
          <div className="product-list">
            <PromotionalFeatures />
            
            <h2 className="product-list-title">Pillock Marketplace</h2>
            
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error">{error}</p>
              </div>
            ) : (
              <div className="categories-container">
                {Object.entries(categorizedProducts).map(([category, categoryProducts], index) => {
                  const filteredCategoryProducts = filterProducts(categoryProducts);
                  
                  if (filteredCategoryProducts.length === 0) return null;

                  return (
                    <React.Fragment key={category}>
                      <div className="category-section">
                        <div className="category-header">
                          <h3 className="category-title">{category}</h3>
                          <Link 
                            to={`/category/${category.toLowerCase()}`} 
                            className="view-more-btn"
                          >
                            View More
                          </Link>
                        </div>
                        <Swiper
                          spaceBetween={20}
                          slidesPerView={1}
                          breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 }
                          }}
                          className="product-carousel"
                        >
                          {filteredCategoryProducts.map((product) => (
                            <SwiperSlide key={product.id}>
                              <ProductCard
                                product={product}
                                onAddToCart={handleAddToCart}
                                isInCart={inCart.includes(product.id)}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      {index % 2 === 1 && <MidPagePromotion />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Ad */}
        <div className="side-ad">
          <AdComponent 
            slot="right-sidebar"
            format="skyscraper"
            client="your-client-id"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
