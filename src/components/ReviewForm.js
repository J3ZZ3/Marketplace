import React, { useState } from 'react';
import './styles/ReviewForm.css'; // Create a separate CSS file for styling

const ReviewForm = ({ onSubmit }) => {
  const [review, setReview] = useState({
    name: '',
    comment: '',
    rating: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review); // Call the onSubmit function passed as a prop
    setReview({ name: '', comment: '', rating: 5 }); // Reset the form
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="rf-form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={review.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="rf-form-group">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          name="comment"
          value={review.comment}
          onChange={handleChange}
          required
        />
      </div>
      <div className="rf-form-group">
        <label htmlFor="rating">Rating</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={review.rating}
          onChange={handleChange}
          min="1"
          max="5"
          required
        />
      </div>
      <button type="submit" className="rf-submit-review-btn">Submit Review</button>
    </form>
  );
};

export default ReviewForm; 