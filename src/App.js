import React, { useState, useEffect, useMemo } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import Header from './components/Header';
import ProductInfo from './components/ProductInfo';
import RatingSummary from './components/RatingSummary';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import { PRODUCT_DATA, INITIAL_REVIEWS } from './data/ProductData';
import {
  loadStoredReviews,
  saveStoredReviews,
  loadHelpfulVotes,
  saveHelpfulVotes,
  calculateReviewStats,
  filterAndSortReviews,
} from './utils/reviews';

function App() {
  const [reviews, setReviews] = useState(() => loadStoredReviews(INITIAL_REVIEWS));
  const [helpfulVotes, setHelpfulVotes] = useState(() => loadHelpfulVotes());
  const [selectedStar, setSelectedStar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    saveStoredReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    saveHelpfulVotes(helpfulVotes);
  }, [helpfulVotes]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

  const visibleReviews = useMemo(
    () =>
      filterAndSortReviews(reviews, {
        starFilter: selectedStar,
        searchQuery,
        sortBy,
      }),
    [reviews, selectedStar, searchQuery, sortBy]
  );

  const scrollToReviews = () => {
    const el = document.getElementById('customer-reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitReview = ({ rating, title, text, author }) => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author,
      rating: Number(rating),
      date: todayIso,
      title,
      text,
      helpfulCount: 0,
      verified: false,
    };

    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setSelectedStar(null);
    setSearchQuery('');
    setSortBy('recent');
    setIsReviewFormOpen(false);
    setSuccessMessage('Thank you! Your review has been submitted and added below.');

    setTimeout(() => {
      scrollToReviews();
    }, 100);
  };

  const handleToggleHelpful = (reviewId) => {
    const alreadyVoted = Boolean(helpfulVotes[reviewId]);

    setHelpfulVotes((prevVotes) => {
      const nextVotes = { ...prevVotes };
      if (alreadyVoted) {
        delete nextVotes[reviewId];
      } else {
        nextVotes[reviewId] = true;
      }
      return nextVotes;
    });

    setReviews((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id !== reviewId) return review;
        const currentCount = Number(review.helpfulCount) || 0;
        const nextCount = alreadyVoted ? Math.max(0, currentCount - 1) : currentCount + 1;
        return {
          ...review,
          helpfulCount: nextCount,
        };
      })
    );
  };

  const handleClearFilters = () => {
    setSelectedStar(null);
    setSearchQuery('');
  };

  return (
    <div id="top" className="app-shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onHomeClick={handleClearFilters}
      />

      <main className="main-content container">
        <ProductInfo
          product={PRODUCT_DATA}
          stats={stats}
          onOpenReviewForm={() => setIsReviewFormOpen(true)}
          onScrollToReviews={scrollToReviews}
        />

        <hr className="section-divider" />

        <section
          id="customer-reviews"
          className="reviews-section"
          aria-labelledby="customer-reviews-heading"
        >
          <div className="reviews-section-header">
            <div>
              <h2 id="customer-reviews-heading" className="section-title">
                Customer Reviews
              </h2>
              <p className="section-subtitle">
                Real-time rating breakdown and customer feedback for {PRODUCT_DATA.name}
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="submission-success-banner" role="status" aria-live="polite">
              <div className="success-banner-content">
                <FiCheckCircle size={18} aria-hidden="true" />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                className="success-banner-close"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss notification"
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          <RatingSummary
            stats={stats}
            selectedStar={selectedStar}
            onSelectStar={setSelectedStar}
            onOpenReviewForm={() => setIsReviewFormOpen(true)}
          />

          <ReviewList
            reviews={visibleReviews}
            totalReviewsCount={stats.totalReviews}
            selectedStar={selectedStar}
            onSelectStar={setSelectedStar}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            helpfulVotes={helpfulVotes}
            onToggleHelpful={handleToggleHelpful}
          />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-brand">
            <strong>ShopReview</strong> — Rating &amp; Review App Demo
          </p>
          <p className="footer-note">
            Product specifications and initial customer reviews are sample demo content stored locally in your browser.
          </p>
        </div>
      </footer>

      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSubmitReview={handleSubmitReview}
        productName={PRODUCT_DATA.name}
      />
    </div>
  );
}

export default App;
