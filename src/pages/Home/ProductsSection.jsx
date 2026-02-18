import { useEffect, useState, useCallback } from "react";
import {
  fetchAllProducts,
  filterProducts,
} from "../../services/products.service";
import ProductCard from "../../components/products/ProductCard";
import ProductFilters from "./ProductFilters";
// Skeleton placeholder cards during load
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img skeleton-pulse" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line--xs skeleton-pulse" />
      <div className="skeleton-line skeleton-line--md skeleton-pulse" />
      <div className="skeleton-line skeleton-line--lg skeleton-pulse" />
      <div className="skeleton-line skeleton-line--price skeleton-pulse" />
    </div>
  </div>
);

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Load all products on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllProducts();
      setProducts(data);
      setIsFiltered(false);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Called by ProductFilters when user clicks "Filter"
  const handleFilter = useCallback(async (filters) => {
    const hasFilters = Object.keys(filters).length > 0;

    if (!hasFilters) {
      // Clear all → reload unfiltered
      loadAll();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await filterProducts(filters);
      setProducts(data);
      setIsFiltered(true);
    } catch {
      setError("Filter failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section className="section">
      {/* Header */}
      <div className="section__header">
        <h2>Available Products</h2>
        {!loading && !error && (
          <p>
            {isFiltered
              ? `Showing ${products.length} filtered result${products.length !== 1 ? "s" : ""}`
              : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
          </p>
        )}
      </div>

      {/* Filters */}
      <ProductFilters onFilter={handleFilter} />

      {/* Results count */}
      {!loading && !error && isFiltered && (
        <div className="results-bar">
          <span className="results-bar__count">
            <strong>{products.length}</strong> result
            {products.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="products-grid">
          <div className="state-box state-box--error">
            <span className="state-box__icon">⚠️</span>
            <p className="state-box__title">{error}</p>
            <p className="state-box__msg">
              Check your connection and try again.
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && !error && (
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="state-box">
              <span className="state-box__icon">🔍</span>
              <p className="state-box__title">No products found</p>
              <p className="state-box__msg">
                Try adjusting or clearing your filters.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
