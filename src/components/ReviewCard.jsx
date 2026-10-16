import React from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiCheckCircle } from 'react-icons/fi';
import StarRating from './StarRating';
import { formatReviewDate, getInitials } from '../utils/reviews';

function ReviewCard({ review, isHelpfulVoted, onToggleHelpful }) {
  const initials = getInitials(review.author);
  const formattedDate = formatReviewDate(review.date);
  const helpfulCount = Number(review.helpfulCount) || 0;

  return (
    <article className="review-card" aria-labelledby={`review-title-${review.id}`}>
      <div className="review-card-header">
        <div className="reviewer-identity">
          <div className="reviewer-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="reviewer-meta">
            <div className="reviewer-name-row">
              <span className="reviewer-name">{review.author || 'Anonymous Customer'}</span>
              {review.verified === true && (
                <span className="verified-badge">
                  <FiCheckCircle size={13} aria-hidden="true" />
                  <span>Verified purchase</span>
                </span>
              )}
            </div>
            <time className="review-date" dateTime={review.date}>
              Reviewed on {formattedDate}
            </time>
          </div>
        </div>

        <div className="review-rating-badge">
          <StarRating
            rating={review.rating}
            size={16}
            idPrefix={`review-${review.id}`}
          />
        </div>
      </div>

      <div className="review-card-body">
        <h3 id={`review-title-${review.id}`} className="review-title">
          {review.title}
        </h3>
        <p className="review-text">{review.text}</p>
      </div>

      <div className="review-card-footer">
        <button
          type="button"
          className={`helpful-btn ${isHelpfulVoted ? 'is-voted' : ''}`}
          onClick={() => onToggleHelpful(review.id)}
          aria-pressed={isHelpfulVoted}
          aria-label={`Mark review by ${review.author || 'Anonymous Customer'} as helpful. Currently ${helpfulCount} people found this helpful.`}
        >
          <FiThumbsUp size={14} aria-hidden="true" />
          <span>Helpful</span>
          <span className="helpful-count">({helpfulCount})</span>
        </button>
        {isHelpfulVoted && (
          <span className="helpful-voted-note" aria-live="polite">
            Thanks for your feedback
          </span>
        )}
      </div>
    </article>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author: PropTypes.string,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    helpfulCount: PropTypes.number,
    verified: PropTypes.bool,
  }).isRequired,
  isHelpfulVoted: PropTypes.bool,
  onToggleHelpful: PropTypes.func.isRequired,
};

export default ReviewCard;
