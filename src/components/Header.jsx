import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX, FiHeadphones } from 'react-icons/fi';

function Header({ searchQuery = '', onSearchChange, onHomeClick }) {
  const handleHome = (e) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const reviewsSection = document.getElementById('customer-reviews');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left">
          <a href="#top" onClick={handleHome} className="brand-logo" aria-label="ShopReview Home">
            <span className="brand-mark" aria-hidden="true">
              <FiHeadphones size={18} />
            </span>
            <span className="brand-name">ShopReview</span>
          </a>

          <nav className="header-nav" aria-label="Primary">
            <a href="#top" onClick={handleHome} className="nav-link is-active">
              Home
            </a>
            <a href="#customer-reviews" className="nav-link">
              Customer Reviews
            </a>
          </nav>
        </div>

        <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
          <label htmlFor="header-review-search" className="sr-only">
            Search customer reviews
          </label>
          <FiSearch className="search-icon" size={16} aria-hidden="true" />
          <input
            id="header-review-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search reviews (e.g. battery, comfort)..."
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange && onSearchChange('')}
              aria-label="Clear search query"
            >
              <FiX size={15} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}

Header.propTypes = {
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  onHomeClick: PropTypes.func,
};

export default Header;
