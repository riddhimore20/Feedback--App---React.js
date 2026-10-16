const REVIEWS_STORAGE_KEY = 'shopreview_product_reviews_v1';
const HELPFUL_VOTES_STORAGE_KEY = 'shopreview_helpful_votes_v1';

/**
 * Safely loads reviews from LocalStorage, falling back to initial demo data.
 */
export function loadStoredReviews(fallbackReviews) {
  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return fallbackReviews;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackReviews;
    }
    return parsed;
  } catch (err) {
    return fallbackReviews;
  }
}

/**
 * Safely saves reviews array to LocalStorage.
 */
export function saveStoredReviews(reviews) {
  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    // Ignore storage quota or private browsing errors safely
  }
}

/**
 * Safely loads the map of review IDs marked helpful by the current user.
 */
export function loadHelpfulVotes() {
  try {
    const raw = window.localStorage.getItem(HELPFUL_VOTES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (err) {
    return {};
  }
}

/**
 * Safely persists the user's helpful votes map to LocalStorage.
 */
export function saveHelpfulVotes(votesMap) {
  try {
    window.localStorage.setItem(HELPFUL_VOTES_STORAGE_KEY, JSON.stringify(votesMap));
  } catch (err) {
    // Ignore storage quota or private browsing errors safely
  }
}

/**
 * Derives average rating, total count, and 5-to-1 star distribution from review data.
 */
export function calculateReviewStats(reviews) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const totalReviews = safeReviews.length;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  safeReviews.forEach((review) => {
    const r = Math.min(5, Math.max(1, Math.round(Number(review.rating) || 0)));
    if (counts[r] !== undefined) {
      counts[r] += 1;
      sum += r;
    }
  });

  const averageRating = totalReviews > 0 ? sum / totalReviews : 0;
  const formattedAverage = totalReviews > 0 ? averageRating.toFixed(1) : '0.0';

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = counts[star];
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return {
      star,
      count,
      percentage,
    };
  });

  return {
    totalReviews,
    averageRating,
    formattedAverage,
    distribution,
  };
}

/**
 * Filters and sorts reviews immutably.
 */
export function filterAndSortReviews(reviews, { starFilter = null, searchQuery = '', sortBy = 'recent' }) {
  const safeReviews = Array.isArray(reviews) ? [...reviews] : [];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = safeReviews.filter((review) => {
    if (starFilter !== null && Number(review.rating) !== Number(starFilter)) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = `${review.title || ''} ${review.text || ''} ${review.author || ''}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'highest') {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (sortBy === 'helpful') {
      const helpfulDiff = (b.helpfulCount || 0) - (a.helpfulCount || 0);
      if (helpfulDiff !== 0) {
        return helpfulDiff;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    // Default: 'recent'
    const timeDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return String(b.id).localeCompare(String(a.id));
  });

  return filtered;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a readable e-commerce review date.
 */
export function formatReviewDate(dateString) {
  if (!dateString) return '';
  const parts = String(dateString).split('-');
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const date = new Date(year, month, day);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  const fallback = new Date(dateString);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return dateString;
}

/**
 * Generates up to 2 uppercase initials from a customer's display name.
 */
export function getInitials(name) {
  const cleaned = String(name || 'Anonymous Customer').trim();
  if (!cleaned) return 'AC';
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}
