import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './styles/CustomerReviews.css';

const CustomerReviews = ({ reviews = [] }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: ''
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Add logic to submit review to your backend
    Swal.fire({
      icon: 'success',
      title: 'Thank you for your review!',
      text: 'Your review has been submitted successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', name: '' });
  };

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
        <div className="review-form-modal">
          <div className="review-form-content">
            <button 
              className="close-modal"
              onClick={() => setShowReviewForm(false)}
            >
              ×
            </button>
            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= newReview.rating ? 'filled' : 'empty'}`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
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