import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './styles/CustomerReviews.css';

const CustomerReviews = ({ reviews = [], onSubmitReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
    title: ''
  });

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      ...newReview,
      date: new Date().toISOString(),
      helpfulVotes: 0,
      id: Date.now().toString()
    };
    onSubmitReview(reviewData);
    
    Swal.fire({
      icon: 'success',
      title: 'Thank you for your review!',
      text: 'Your review has been submitted successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', name: '', title: '' });
  };

  const getSortedReviews = () => {
    const sortedReviews = [...reviews];
    switch (sortBy) {
      case 'helpful':
        return sortedReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
      case 'highest':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
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

      <div className="review-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating}</div>
          <div className="rating-stars">
            {renderStars(parseFloat(averageRating))}
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

      <div className="reviews-controls">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

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
                <label>Review Title</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  required
                  placeholder="Summarize your review"
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

      <div className="reviews-list">
        {getSortedReviews().map((review) => (
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
            <h4 className="review-title">{review.title}</h4>
            <div className="review-date">
              {new Date(review.date).toLocaleDateString()}
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-footer">
              <button 
                className="helpful-button"
                onClick={() => onSubmitReview({ ...review, helpfulVotes: (review.helpfulVotes || 0) + 1 })}
              >
                <i className="fas fa-thumbs-up"></i> Helpful ({review.helpfulVotes || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews; 