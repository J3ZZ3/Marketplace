import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles/RelatedProducts.css';

const RelatedProducts = ({ products, onAddToCart }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
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

  return (
    <div className="you-might-like-section">
      <h2 className="section-title">You Might Like</h2>
      <div className="carousel-container">
        <Slider {...settings}>
          {products.map(product => (
            <div className="carousel-slide" key={product.id}>
              <div className="related-product-card-wrapper">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  isInCart={false}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default RelatedProducts; 