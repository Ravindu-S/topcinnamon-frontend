import { useState, useEffect } from 'react';
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import './Reviews.css';

function Reviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/approved?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      // First, get product details to include product name
      const productResponse = await fetch(`http://localhost:8080/products/${productId}`);
      const product = await productResponse.json();
      
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: user.name || user.email.split('@')[0], // Use name or email prefix
          email: user.email,
          rating: newReview.rating,
          reviewTitle: newReview.title,
          comment: newReview.comment,
          productId: productId,
          productName: product.name || 'Cinnamon Product',
          productType: product.category || 'Cinnamon Quills (Alba)',
          verifiedPurchase: false // Allow reviews without purchase for now
        })
      });

      if (response.ok) {
        setNewReview({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
        alert('Review submitted successfully!');
      } else {
        const errorData = await response.text();
        console.error('Review submission error:', errorData);
        alert(`Failed to submit review: ${errorData}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive && onChange ? () => onChange(index + 1) : undefined}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="reviews-container">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{getAverageRating()}</span>
            <div className="stars-display">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <span className="review-count">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="rating-breakdown">
          <h3>Rating Breakdown</h3>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = getRatingDistribution()[rating];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} star{rating !== 1 ? 's' : ''}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {user && (
        <div className="review-form-section">
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-title">Review Title</label>
                <input
                  type="text"
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="review-comment">Your Review</label>
                <textarea
                  id="review-comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Tell others about your experience with this product"
                  rows="4"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <FaUser className="user-icon" />
                  <div>
                    <h4>{review.customerName || 'Anonymous'}</h4>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.reviewTitle && (
                <h5 className="review-title">{review.reviewTitle}</h5>
              )}

              <p className="review-comment">{review.comment}</p>

              <div className="review-actions">
                <button className="action-btn">
                  <FaThumbsUp /> Helpful
                </button>
                <button className="action-btn">
                  <FaThumbsDown /> Not Helpful
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;
