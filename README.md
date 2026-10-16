# Rating and Review App (`ShopReview`)

A clean, realistic e-commerce product detail and customer reviews application built with React.

This project showcases how a modern online storefront presents product details, calculates real-time customer rating distributions, and handles interactive customer reviews on a single product page (**Wireless Headphones**).

---

## Features

- **E-Commerce Product Detail Showcase**
  - Sticky `ShopReview` storefront header with quick navigation and live review keyword search.
  - Semantic breadcrumb navigation (`Home > Electronics > Headphones`).
  - Responsive 2-column desktop / stacked mobile product layout with a high-resolution studio product photograph (plus an automatic vector illustration fallback if offline), technical specifications strip, feature checklist, pricing, and trust badges.
- **Dynamic Customer Review Summary**
  - Real-time calculation of the overall average star rating (`4.4 out of 5` initially) and total review count directly from the review state.
  - Interactive 5-star to 1-star rating breakdown with proportional progress bars, percentages, and review counts. Clicking any star bar filters the review list below.
- **Interactive Review Cards**
  - Customer avatar with auto-generated initials, customer name, formatted review date, star rating, review title, and full review text.
  - Conditional **Verified purchase** badge displayed only on demo reviews explicitly marked as verified.
  - **Helpful** vote toggle button with a thumbs-up icon and live count that increments on click and removes the vote when clicked again.
- **Sorting & Multi-Faceted Filtering**
  - Filter reviews by star rating (`All`, `5 ★`, `4 ★`, `3 ★`, `2 ★`, `1 ★`) via either the filter pills or the rating summary bars.
  - Filter reviews by keyword using the header search input.
  - Sort reviews by **Most Recent**, **Highest Rating**, or **Most Helpful**.
  - One-click **Clear filter** control and a helpful empty state when no reviews match the active criteria.
- **Accessible "Write a Review" Modal Form**
  - Clickable and keyboard-accessible (`ArrowLeft` / `ArrowRight` / `Home` / `End`) 1–5 star rating selector with live descriptive labels (`Poor` to `Excellent`).
  - Required field validation for star rating, review headline, and review description, plus an optional display name field (defaults to `Anonymous Customer`).
  - Immediate list update, live recalculation of average rating and star distribution bars, confirmation banner, and `Escape` / backdrop-click support.
- **LocalStorage Persistence**
  - Submitted reviews and helpful-vote toggles are safely persisted in `localStorage` so changes survive page refreshes.

---

## Technologies Used

- **React 18** (Functional Components, `useState`, `useEffect`, `useMemo`, `useRef`)
- **JavaScript (ES6+)**
- **CSS3** (Custom properties, CSS Grid, Flexbox, responsive media queries, accessible focus states)
- **React Icons (`react-icons/fi`)** & custom SVG star icons with fractional fill support
- **Create React App (`react-scripts`)**

---

## Project Structure

```text
src/
├── components/
│   ├── shared/
│   │   └── Button.jsx        # Reusable button component (primary, outline, ghost)
│   ├── Header.jsx            # Storefront header with logo, links, and review search
│   ├── ProductInfo.jsx       # Breadcrumbs, product gallery, specs, features, and CTAs
│   ├── RatingSummary.jsx     # Calculated average rating and 5-to-1 star progress bars
│   ├── ReviewCard.jsx        # Individual customer review item with Helpful toggle
│   ├── ReviewForm.jsx        # Accessible modal form to submit a new 1–5 star review
│   ├── ReviewList.jsx        # Star filter pills, sort selector, empty state, and list
│   └── StarRating.jsx        # Read-only fractional star display & interactive radio group
├── data/
│   └── ProductData.js        # Demo product data and initial sample customer reviews
├── utils/
│   └── reviews.js            # Pure rating calculation, sort/filter, and safe LocalStorage helpers
├── App.js                    # Root state management and page layout
├── index.css                 # Storefront design system and responsive styles
└── index.js                  # Application entry point
```

---

## Setup & Installation

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd feedback-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Create a production build:**
   ```bash
   npm run build
   ```

---

## Known Demo Limitations

- **Single-Product Scope:** Designed intentionally around one flagship demo product (`Wireless Headphones`) to focus on the customer review UX rather than multi-page cart/checkout flows.
- **Browser-Local Storage:** Reviews and helpful votes are stored in the visitor's browser via `localStorage` (`shopreview_product_reviews_v1` and `shopreview_helpful_votes_v1`). Clearing browser site data resets the reviews back to the initial 8 sample reviews.
- **No Backend or Authentication:** Newly submitted reviews do not require user login and are not marked with the `Verified purchase` badge (which is reserved for verified records in the initial dataset).
