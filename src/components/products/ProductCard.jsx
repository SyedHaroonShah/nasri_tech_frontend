import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {/* Image */}
      <div className="product-card__image">
        <img src={imageUrl} alt={product.productName} loading="lazy" />

        {/* Stock Badge */}
        <span
          className={`badge ${product.inStock ? "badge--in" : "badge--out"}`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Content */}
      <div className="product-card__content">
        <p className="product-card__brand">{product.brand}</p>

        <h4 className="product-card__title">{product.productName}</h4>

        {/* Meta Tags */}
        <div className="product-card__meta">
          {product.cameraType && (
            <span className="meta-tag">{product.cameraType}</span>
          )}
          {product.resolution && (
            <span className="meta-tag">{product.resolution}</span>
          )}
          {product.warrantyMonths > 0 && (
            <span className="meta-tag">{product.warrantyMonths}M Warranty</span>
          )}
        </div>

        {/* Footer */}
        <div className="product-card__footer">
          <span className="product-card__price">
            Rs. {product.price.toLocaleString()}
          </span>

          <span className="product-card__cta">
            View
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
