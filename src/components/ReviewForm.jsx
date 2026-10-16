import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import StarRating from './StarRating';
import Button from './shared/Button';

function ReviewForm({ isOpen, onClose, onSubmitReview, productName }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const validate = () => {
    const nextErrors = {};
    if (!rating || rating < 1 || rating > 5) {
      nextErrors.rating = 'Please select a star rating between 1 and 5.';
    }
    if (!title.trim()) {
      nextErrors.title = 'Please enter a short headline for your review.';
    } else if (title.trim().length < 4) {
      nextErrors.title = 'Review title must be at least 4 characters.';
    }
    if (!text.trim()) {
      nextErrors.text = 'Please write a description sharing your experience.';
    } else if (text.trim().length < 15) {
      nextErrors.text = 'Review description must be at least 15 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRatingSelect = (newRating) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (errors.text) {
      setErrors((prev) => ({ ...prev, text: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitReview({
      rating,
      title: title.trim(),
      text: text.trim(),
      author: author.trim() || 'Anonymous Customer',
    });

    setRating(0);
    setTitle('');
    setText('');
    setAuthor('');
    setErrors({});
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-modal-title"
        aria-describedby="write-review-modal-subtitle"
      >
        <div className="modal-header">
          <div>
            <h2 id="write-review-modal-title" className="modal-title">
              Write a Customer Review
            </h2>
            <p id="write-review-modal-subtitle" className="modal-subtitle">
              {productName}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close review form"
          >
            <FiX size={20} />
          </button>
        </div>

        <form className="review-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <span className="form-label">
              Overall rating <span className="required-star">*</span>
            </span>
            <StarRating
              rating={rating}
              size={28}
              interactive
              showLabel
              onChange={handleRatingSelect}
              idPrefix="form-rating"
            />
            {errors.rating && (
              <p className="field-error" role="alert">
                <FiAlertCircle size={14} aria-hidden="true" />
                <span>{errors.rating}</span>
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="review-title-input" className="form-label">
              Review title <span className="required-star">*</span>
            </label>
            <input
              id="review-title-input"
              type="text"
              className={`form-input ${errors.title ? 'has-error' : ''}`}
              placeholder="Summarize your experience (e.g., Impressive soundstage and comfort)"
              value={title}
              onChange={handleTitleChange}
              maxLength={100}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'review-title-error' : undefined}
            />
            {errors.title && (
              <p id="review-title-error" className="field-error" role="alert">
                <FiAlertCircle size={14} aria-hidden="true" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div className="form-field">
            <div className="form-label-row">
              <label htmlFor="review-text-input" className="form-label">
                Review description <span className="required-star">*</span>
              </label>
              <span className="char-counter">{text.trim().length} / 1000</span>
            </div>
            <textarea
              id="review-text-input"
              rows={4}
              className={`form-textarea ${errors.text ? 'has-error' : ''}`}
              placeholder="What did you like or dislike? How is the sound quality, comfort, and battery life?"
              value={text}
              onChange={handleTextChange}
              maxLength={1000}
              aria-invalid={Boolean(errors.text)}
              aria-describedby={errors.text ? 'review-text-error' : undefined}
            />
            {errors.text && (
              <p id="review-text-error" className="field-error" role="alert">
                <FiAlertCircle size={14} aria-hidden="true" />
                <span>{errors.text}</span>
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="review-author-input" className="form-label">
              Display name <span className="optional-tag">(Optional)</span>
            </label>
            <input
              id="review-author-input"
              type="text"
              className="form-input"
              placeholder="e.g., Alex M. (leaves as Anonymous Customer if blank)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              version="ghost"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              version="primary"
              size="md"
            >
              Submit review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReviewForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitReview: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
};

export default ReviewForm;
