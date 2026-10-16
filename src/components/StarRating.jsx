import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Average',
  4: 'Very Good',
  5: 'Excellent',
};

function StarIcon({ fillPercentage = 100, size = 18, gradientId }) {
  const clampedFill = Math.max(0, Math.min(100, fillPercentage));
  const isPartial = clampedFill > 0 && clampedFill < 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="star-svg"
    >
      {isPartial && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${clampedFill}%`} stopColor="var(--star-fill, #d97706)" />
            <stop offset={`${clampedFill}%`} stopColor="var(--star-empty, #e5e2dc)" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={
          isPartial
            ? `url(#${gradientId})`
            : clampedFill === 100
              ? 'var(--star-fill, #d97706)'
              : 'var(--star-empty, #e5e2dc)'
        }
        stroke={
          clampedFill > 0
            ? 'var(--star-stroke, #b45309)'
            : 'var(--star-empty-stroke, #cbc6be)'
        }
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.51 9.39l6.56-.95L12 2.5z"
      />
    </svg>
  );
}

function StarRating({
  rating = 0,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange,
  idPrefix = 'star-rating',
  showLabel = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const buttonRefs = useRef([]);

  const displayValue = interactive ? hoverRating || rating : Number(rating) || 0;

  const handleKeyDown = (event, starValue) => {
    if (!interactive || !onChange) return;

    let nextValue = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextValue = Math.min(maxStars, (rating || 0) + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextValue = Math.max(1, (rating || 2) - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextValue = 1;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextValue = maxStars;
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      nextValue = starValue;
    }

    if (nextValue !== null) {
      onChange(nextValue);
      const targetBtn = buttonRefs.current[nextValue - 1];
      if (targetBtn) {
        targetBtn.focus();
      }
    }
  };

  if (!interactive) {
    const roundedLabel = Number(rating).toFixed(1).replace(/\.0$/, '');
    return (
      <span
        className="star-rating-readonly"
        role="img"
        aria-label={`Rated ${roundedLabel} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }, (_, index) => {
          const starNumber = index + 1;
          const diff = displayValue - index;
          const fillPercentage = diff >= 1 ? 100 : diff > 0 ? Math.round(diff * 100) : 0;
          return (
            <StarIcon
              key={starNumber}
              size={size}
              fillPercentage={fillPercentage}
              gradientId={`${idPrefix}-grad-${starNumber}`}
            />
          );
        })}
      </span>
    );
  }

  const activeRatingLabel = RATING_LABELS[displayValue] || 'Select a rating';

  return (
    <div className="star-rating-interactive-wrapper">
      <div
        className="star-rating-selector"
        role="radiogroup"
        aria-label="Product star rating"
        onMouseLeave={() => setHoverRating(0)}
      >
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          const isChecked = starValue === rating;
          const isTabFocusable = rating > 0 ? isChecked : starValue === 1;

          return (
            <button
              key={starValue}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isChecked}
              aria-label={`${starValue} ${starValue === 1 ? 'star' : 'stars'} — ${RATING_LABELS[starValue]}`}
              tabIndex={isTabFocusable ? 0 : -1}
              className={`star-selector-btn ${isFilled ? 'is-filled' : ''} ${isChecked ? 'is-selected' : ''}`}
              onClick={() => onChange && onChange(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onKeyDown={(e) => handleKeyDown(e, starValue)}
            >
              <StarIcon
                size={size}
                fillPercentage={isFilled ? 100 : 0}
                gradientId={`${idPrefix}-interactive-${starValue}`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className={`star-rating-status ${displayValue > 0 ? 'has-selection' : ''}`} aria-live="polite">
          {displayValue > 0 ? `${displayValue} out of 5 stars (${activeRatingLabel})` : 'Click to rate from 1 to 5 stars'}
        </span>
      )}
    </div>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number,
  maxStars: PropTypes.number,
  size: PropTypes.number,
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  idPrefix: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default StarRating;
