import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore';
import ReviewForm from './ReviewForm'; // Import the ReviewForm component
import './styles/CustomerReviews.css';

const CustomerReviews = ({ productId, userId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = async (review) => {
    try {
      // Add review to Firestore
      await addDoc(collection(db, 'reviews'), {
        userId: userId,
        productId: productId,
        name: review.name,
        comment: review.comment,
        rating: review.rating,
        date: new Date(),
      });
      // Optionally, fetch updated reviews here
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      // Fetch reviews from Firestore (optional)
      // You can implement this if you want to display existing reviews
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="section-title">Customer Reviews</h2>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(true)}
        >
          Write a Review
        </button>
      </div>

      {/* Review Summary */}
      <div className="review-summary">
        <div className="average-rating">
          <div className="rating-number">4.5</div>
          <div className="rating-stars">
            {renderStars(4.5)}
          </div>
          <div className="total-reviews">
            Based on {reviews.length} reviews
          </div>
        </div>

        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="rating-bar">
              <span>{stars} stars</span>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${(reviews.filter(r => Math.floor(r.rating) === stars).length / reviews.length) * 100}%` 
                  }}
                />
              </div>
              <span className="bar-count">
                {reviews.filter(r => Math.floor(r.rating) === stars).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="gg-review-form-modal">
          <div className="gg-review-form-content" style={{ backgroundColor: '#666' }}>
            <button 
              className="gg-close-modal"
              onClick={() => setShowReviewForm(false)}
            >
              
            </button>
            <div className="review-form-content">
              <button 
                className="close-modal"
                onClick={() => setShowReviewForm(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              >
                &times;
              </button>
              <h3>Write a Review</h3>
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{review.name}</span>
                {review.verified && (
                  <span className="verified-badge">
                    <i className="fas fa-check-circle"></i> Verified Purchase
                  </span>
                )}
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="review-date">
              {new Date(review.date).toLocaleDateString()}
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews; 