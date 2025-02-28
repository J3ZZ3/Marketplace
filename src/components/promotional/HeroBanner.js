import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles/HeroBanner.css';

const HeroBanner = () => {
  const promotionalBanners = [
    {
      id: 1,
      image: require('../assets/1.png'),
      link: "/category/other"
    },
    {
      id: 2,
      image: require('../assets/2.png'),
      link: "/category/clothing"
    },
    {
      id: 3,
      image: require('../assets/3.png'),
      link: "/category/electronics"
    }
  ];

  return (
    <div className="hero-banner">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="banner-carousel"
      >
        {promotionalBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link to={banner.link} className="banner-link">
              <div className="banner-image-wrapper">
                <img src={banner.image} alt="Promotional Banner" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner; 