import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiChevronRight, FiEdit3, FiShield, FiTruck } from 'react-icons/fi';
import StarRating from './StarRating';
import Button from './shared/Button';

function HeadphoneFallbackIllustration() {
  return (
    <div className="product-image-fallback" role="img" aria-label="Wireless Headphones illustration">
      <svg viewBox="0 0 320 280" width="220" height="190" aria-hidden="true">
        <defs>
          <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2c30" />
            <stop offset="100%" stopColor="#141416" />
          </linearGradient>
        </defs>
        <path
          d="M68 150 C68 78, 252 78, 252 150"
          fill="none"
          stroke="url(#headbandGrad)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <rect x="52" y="136" width="38" height="84" rx="19" fill="#1f2024" stroke="#3f4148" strokeWidth="3" />
        <rect x="230" y="136" width="38" height="84" rx="19" fill="#1f2024" stroke="#3f4148" strokeWidth="3" />
        <rect x="74" y="146" width="18" height="64" rx="9" fill="#b45309" opacity="0.85" />
        <rect x="228" y="146" width="18" height="64" rx="9" fill="#b45309" opacity="0.85" />
      </svg>
      <span className="fallback-caption">Wireless Headphones — Obsidian Matte Black</span>
    </div>
  );
}

function ProductInfo({ product, stats, onOpenReviewForm, onScrollToReviews }) {
  const [imageError, setImageError] = useState(false);

  const formattedPrice = `${product.currency}${product.price.toFixed(2)}`;

  return (
    <section className="product-section" aria-labelledby="product-heading">
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {product.breadcrumbs.map((crumb, index) => {
            const isLast = index === product.breadcrumbs.length - 1;
            return (
              <li key={crumb} className="breadcrumb-item">
                {!isLast ? (
                  <>
                    <a
                      href="#top"
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="breadcrumb-link"
                    >
                      {crumb}
                    </a>
                    <FiChevronRight className="breadcrumb-separator" size={14} aria-hidden="true" />
                  </>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {crumb}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="product-grid">
        <div className="product-media">
          <div className="product-image-frame">
            <span className="product-badge">Flagship Studio Series</span>
            {!imageError ? (
              <img
                src={product.image.src}
                alt={product.image.alt}
                className="product-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <HeadphoneFallbackIllustration />
            )}
          </div>
          <div className="product-specs-strip" aria-label="Technical highlights">
            {product.specs.map((spec) => (
              <div key={spec.label} className="spec-item">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="product-details">
          <div className="product-brand-row">
            <span className="product-brand">{product.brand}</span>
            {product.inStock && <span className="stock-pill">In Stock</span>}
          </div>

          <h1 id="product-heading" className="product-title">
            {product.name}
          </h1>

          <div className="product-rating-bar">
            <StarRating rating={stats.averageRating} size={18} idPrefix="product-hero" />
            <span className="product-rating-number">{stats.formattedAverage}</span>
            <span className="rating-divider" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              className="reviews-jump-link"
              onClick={onScrollToReviews}
            >
              {stats.totalReviews} {stats.totalReviews === 1 ? 'customer review' : 'customer reviews'}
            </button>
          </div>

          <div className="product-price-block">
            <span className="product-price">{formattedPrice}</span>
            <span className="product-color-meta">Finish: {product.color}</span>
          </div>

          <p className="product-description">{product.shortDescription}</p>

          <div className="product-features-block">
            <h2 className="features-heading">Key Features</h2>
            <ul className="features-list">
              {product.features.map((feature) => (
                <li key={feature} className="feature-item">
                  <span className="feature-check" aria-hidden="true">
                    <FiCheck size={15} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="product-actions">
            <Button
              version="primary"
              size="lg"
              onClick={onOpenReviewForm}
              className="write-review-hero-btn"
            >
              <FiEdit3 size={17} aria-hidden="true" />
              <span>Write a review</span>
            </Button>
            <Button
              version="outline"
              size="lg"
              onClick={onScrollToReviews}
            >
              Read customer reviews ({stats.totalReviews})
            </Button>
          </div>

          <div className="product-trust-row">
            <div className="trust-item">
              <FiTruck size={16} aria-hidden="true" />
              <span>Free expedited shipping &amp; 30-day audition trial</span>
            </div>
            <div className="trust-item">
              <FiShield size={16} aria-hidden="true" />
              <span>2-year international manufacturer warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProductInfo.propTypes = {
  product: PropTypes.shape({
    brand: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    breadcrumbs: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    inStock: PropTypes.bool,
    color: PropTypes.string,
    shortDescription: PropTypes.string.isRequired,
    image: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }).isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    specs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  stats: PropTypes.shape({
    totalReviews: PropTypes.number.isRequired,
    averageRating: PropTypes.number.isRequired,
    formattedAverage: PropTypes.string.isRequired,
  }).isRequired,
  onOpenReviewForm: PropTypes.func.isRequired,
  onScrollToReviews: PropTypes.func.isRequired,
};

export default ProductInfo;
