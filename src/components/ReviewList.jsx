import React from 'react';
import PropTypes from 'prop-types';
import { FiFilter, FiX, FiMessageSquare } from 'react-icons/fi';
import ReviewCard from './ReviewCard';
import Button from './shared/Button';

const STAR_OPTIONS = [5, 4, 3, 2, 1];

function ReviewList({
  reviews,
  totalReviewsCount,
  selectedStar,
  onSelectStar,
  searchQuery,
  onClearFilters,
  sortBy,
  onSortChange,
  helpfulVotes,
  onToggleHelpful,
}) {
  const hasActiveFilter = selectedStar !== null || Boolean(searchQuery && searchQuery.trim());

  return (
    <div className="review-list-section">
      <div className="reviews-controls-bar" role="region" aria-label="Filter and sort customer reviews">
        <div className="star-filter-group" role="group" aria-label="Filter reviews by star rating">
          <span className="controls-label">
            <FiFilter size={14} aria-hidden="true" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            className={`filter-pill ${selectedStar === null ? 'is-active' : ''}`}
            onClick={() => onSelectStar(null)}
            aria-pressed={selectedStar === null}
          >
            All ({totalReviewsCount})
          </button>
          {STAR_OPTIONS.map((star) => {
            const isSelected = selectedStar === star;
            return (
              <button
                key={star}
                type="button"
                className={`filter-pill ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelectStar(isSelected ? null : star)}
                aria-pressed={isSelected}
              >
                {star} ★
              </button>
            );
          })}
        </div>

        <div className="sort-control-group">
          <label htmlFor="review-sort-select" className="controls-label">
            Sort by:
          </label>
          <select
            id="review-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="reviews-status-row">
        <p className="reviews-showing-text" aria-live="polite">
          Showing <strong>{reviews.length}</strong> of <strong>{totalReviewsCount}</strong>{' '}
          {totalReviewsCount === 1 ? 'review' : 'reviews'}
          {selectedStar !== null && (
            <span>
              {' '}
              with <strong>{selectedStar}-star</strong> rating
            </span>
          )}
          {searchQuery && searchQuery.trim() && (
            <span>
              {' '}
              matching <strong>“{searchQuery.trim()}”</strong>
            </span>
          )}
        </p>

        {hasActiveFilter && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={onClearFilters}
          >
            <FiX size={14} aria-hidden="true" />
            <span>Clear filter</span>
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-empty-state" role="status">
          <div className="empty-icon-circle" aria-hidden="true">
            <FiMessageSquare size={24} />
          </div>
          <h3 className="empty-state-title">No matching customer reviews</h3>
          <p className="empty-state-text">
            {selectedStar !== null && searchQuery
              ? `We couldn't find any ${selectedStar}-star reviews matching "${searchQuery}".`
              : selectedStar !== null
                ? `There are currently no ${selectedStar}-star reviews for this product.`
                : `We couldn't find any reviews matching "${searchQuery}".`}
          </p>
          {hasActiveFilter && (
            <Button version="outline" size="md" onClick={onClearFilters}>
              Clear filter &amp; show all reviews
            </Button>
          )}
        </div>
      ) : (
        <div className="reviews-stack">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isHelpfulVoted={Boolean(helpfulVotes[review.id])}
              onToggleHelpful={onToggleHelpful}
            />
          ))}
        </div>
      )}
    </div>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalReviewsCount: PropTypes.number.isRequired,
  selectedStar: PropTypes.number,
  onSelectStar: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  onClearFilters: PropTypes.func.isRequired,
  sortBy: PropTypes.oneOf(['recent', 'highest', 'helpful']).isRequired,
  onSortChange: PropTypes.func.isRequired,
  helpfulVotes: PropTypes.object.isRequired,
  onToggleHelpful: PropTypes.func.isRequired,
};

export default ReviewList;
