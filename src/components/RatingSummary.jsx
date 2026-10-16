import React from 'react';
import PropTypes from 'prop-types';
import { FiEdit3 } from 'react-icons/fi';
import StarRating from './StarRating';
import Button from './shared/Button';

function RatingSummary({
  stats,
  selectedStar,
  onSelectStar,
  onOpenReviewForm,
}) {
  const { totalReviews, averageRating, formattedAverage, distribution } = stats;

  return (
    <div className="rating-summary-card" aria-label="Customer review summary">
      <div className="summary-score-col">
        <div className="summary-score-header">
          <span className="summary-big-number">{formattedAverage}</span>
          <span className="summary-out-of">out of 5</span>
        </div>
        <div className="summary-stars-wrap">
          <StarRating rating={averageRating} size={22} idPrefix="summary-avg" />
        </div>
        <p className="summary-total-text">
          Based on <strong>{totalReviews}</strong> {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
        <span className="demo-notice-tag">Demo Storefront Reviews</span>
      </div>

      <div className="summary-bars-col" role="group" aria-label="Rating distribution by star count">
        {distribution.map(({ star, count, percentage }) => {
          const isSelected = selectedStar === star;
          return (
            <button
              key={star}
              type="button"
              className={`distribution-row ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelectStar(isSelected ? null : star)}
              aria-pressed={isSelected}
              aria-label={`Filter by ${star} star reviews: ${count} reviews (${percentage}%)`}
            >
              <span className="distribution-star-label">
                {star} <span aria-hidden="true">★</span>
              </span>
              <div className="distribution-bar-track" aria-hidden="true">
                <div
                  className="distribution-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="distribution-percentage">{percentage}%</span>
              <span className="distribution-count">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="summary-cta-col">
        <h3 className="summary-cta-title">Share your experience</h3>
        <p className="summary-cta-desc">
          Own the Wireless Headphones? Help fellow listeners make an informed decision.
        </p>
        <Button
          version="primary"
          size="md"
          onClick={onOpenReviewForm}
          className="summary-write-btn"
        >
          <FiEdit3 size={16} aria-hidden="true" />
          <span>Write a review</span>
        </Button>
      </div>
    </div>
  );
}

RatingSummary.propTypes = {
  stats: PropTypes.shape({
    totalReviews: PropTypes.number.isRequired,
    averageRating: PropTypes.number.isRequired,
    formattedAverage: PropTypes.string.isRequired,
    distribution: PropTypes.arrayOf(
      PropTypes.shape({
        star: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  selectedStar: PropTypes.number,
  onSelectStar: PropTypes.func.isRequired,
  onOpenReviewForm: PropTypes.func.isRequired,
};

export default RatingSummary;
