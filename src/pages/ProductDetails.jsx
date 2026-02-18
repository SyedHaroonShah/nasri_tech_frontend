import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/products.service";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data?.images?.length > 0) {
          setActiveImage(data.images[0].url);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-details-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Loading...</span>
        </div>
        <div className="product-details-container">
          {/* Image skeleton */}
          <div>
            <div
              className="skeleton-pulse"
              style={{ aspectRatio: "1/1", borderRadius: 18, marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-pulse"
                  style={{ width: 62, height: 62, borderRadius: 10 }}
                />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[35, 80, 55, 100, 70].map((w, i) => (
              <div
                key={i}
                className="skeleton-pulse"
                style={{
                  height: i === 2 ? 32 : 14,
                  width: `${w}%`,
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div
          className="state-box state-box--error"
          style={{ gridColumn: "unset" }}
        >
          <span className="state-box__icon">🚫</span>
          <p className="state-box__title">Product not found</p>
          <p className="state-box__msg">
            <Link to="/" style={{ color: "#22c55e", fontWeight: 600 }}>
              ← Back to products
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <nav className="product-details-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/">Products</Link>
        <span>›</span>
        <span>{product.productName}</span>
      </nav>

      <div className="product-details-container">
        {/* ── LEFT: Images ── */}
        <div className="product-images">
          <div className="main-image">
            <img src={activeImage} alt={product.productName} />
          </div>

          {product.images?.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`${product.productName} view ${index + 1}`}
                  className={activeImage === img.url ? "active-thumb" : ""}
                  onClick={() => setActiveImage(img.url)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActiveImage(img.url)
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Details ── */}
        <div className="product-info">
          {/* Brand pill */}
          <span className="product-info__brand">{product.brand}</span>

          <h1>{product.productName}</h1>

          {/* Price + Stock */}
          <div className="price-stock">
            <span className="price">Rs. {product.price.toLocaleString()}</span>
            <span className={product.inStock ? "in-stock" : "out-stock"}>
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="description">{product.description}</p>
          )}

          {/* Specifications */}
          <div className="specs">
            <h3>Specifications</h3>
            <ul>
              <li>
                <strong>Camera Type</strong>
                <span>{product.cameraType}</span>
              </li>
              <li>
                <strong>Resolution</strong>
                <span>{product.resolution}</span>
              </li>
              <li>
                <strong>Lens Type</strong>
                <span>{product.lensType || "N/A"}</span>
              </li>
              <li>
                <strong>Night Vision</strong>
                <span>{product.nightVision ? "✓ Yes" : "✗ No"}</span>
              </li>
              <li>
                <strong>Storage Support</strong>
                <span>{product.storageSupport || "N/A"}</span>
              </li>
              <li>
                <strong>Warranty</strong>
                <span>{product.warrantyMonths} Months</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="features">
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
