import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addToCart } from '../redux/actions';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from 'sweetalert2';
import './styles/ProductList.css';
import Navbar from './Navbar';
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [inCart, setInCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const departments = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home & Living' },
    { id: 'sports', label: 'Sports & Outdoors' },
    { id: 'beauty', label: 'Beauty & Health' },
    { id: 'books', label: 'Books & Media' }
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  useEffect(() => {
    const fetchProductsFromFirestore = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          category: doc.data().category || 'electronics'
        }));
        
        dispatch(setProducts(productList));
      } catch (error) {
        console.error("Error fetching products: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load products. Please try again.',
        });
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

  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'electronics';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="product-list">
        <nav className="department-nav">
          {departments.map(dept => (
            <a 
              key={dept.id}
              href={`#${dept.id}`}
              className={`department-link ${activeFilter === dept.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(dept.id)}
            >
              {dept.label}
            </a>
          ))}
        </nav>

        <div className="search-filters">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {departments.map(dept => {
          const categoryProducts = productsByCategory[dept.id] || [];
          const filteredProducts = categoryProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
          );

          if (filteredProducts.length === 0) return null;

          return (
            <div key={dept.id} id={dept.id} className="category-section">
              <div className="section-header">
                <h2 className="section-title">{dept.label}</h2>
                <a href={`/category/${dept.id}`} className="view-all">View All</a>
              </div>
              <div className="carousel-container">
                <Slider {...sliderSettings}>
                  {filteredProducts.map(product => (
                    <div key={product.id} className="carousel-item">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isInCart={inCart.includes(product.id)}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          );
        })}

        {Object.values(productsByCategory).every(category => category.length === 0) && (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
