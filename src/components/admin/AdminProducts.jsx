import { useState, useEffect } from "react";
import {
  fetchAllAdminProducts,
  createProduct,
  updateProduct,
  updateProductImages,
  deleteProduct,
} from "../../services/admin/products.service";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const AdminProducts = () => {
  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, filterStock, filterType, filterBrand]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search by name or brand
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.productId.toLowerCase().includes(query),
      );
    }

    // Filter by stock
    if (filterStock) {
      filtered = filtered.filter((p) =>
        filterStock === "in" ? p.inStock : !p.inStock,
      );
    }

    // Filter by camera type
    if (filterType) {
      filtered = filtered.filter((p) => p.cameraType === filterType);
    }

    // Filter by brand
    if (filterBrand) {
      filtered = filtered.filter((p) => p.brand === filterBrand);
    }

    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStock("");
    setFilterType("");
    setFilterBrand("");
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadProducts();
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    loadProducts();
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProduct._id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    }
  };

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
  };

  // Get unique brands
  const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort();

  return (
    <div className="admin-products-page">
      {/* Header */}
      <div className="products-header">
        <div className="products-header__left">
          <h1>📦 Product Management</h1>
          <p>Manage your camera inventory</p>
        </div>
        <div className="products-header__right">
          <button
            className="btn-create-product"
            onClick={() => setShowCreateModal(true)}
          >
            <span>➕</span>
            Add Product
          </button>
          <button className="btn-refresh" onClick={loadProducts}>
            <span>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="stat-card stat-card--total">
          <div className="stat-card__icon">📦</div>
          <div className="stat-card__content">
            <h3>Total Products</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card stat-card--stock">
          <div className="stat-card__icon">✅</div>
          <div className="stat-card__content">
            <h3>In Stock</h3>
            <p>{stats.inStock}</p>
          </div>
        </div>

        <div className="stat-card stat-card--out">
          <div className="stat-card__icon">❌</div>
          <div className="stat-card__content">
            <h3>Out of Stock</h3>
            <p>{stats.outOfStock}</p>
          </div>
        </div>

        <div className="stat-card stat-card--value">
          <div className="stat-card__icon">💰</div>
          <div className="stat-card__content">
            <h3>Total Value</h3>
            <p>Rs. {stats.totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="products-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, brand, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="IP">IP Camera</option>
            <option value="Analog">Analog Camera</option>
            <option value="WiFi">WiFi Camera</option>
          </select>

          <select
            className="filter-select"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {(searchQuery || filterStock || filterType || filterBrand) && (
            <button className="btn-clear-filters" onClick={handleClearFilters}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h3 className="empty-state__title">
              {products.length === 0
                ? "No products yet"
                : "No products match your filters"}
            </h3>
            <p className="empty-state__text">
              {products.length === 0
                ? "Get started by adding your first product"
                : "Try adjusting your search or filters"}
            </p>
            {products.length === 0 && (
              <button
                className="btn-create-product"
                onClick={() => setShowCreateModal(true)}
              >
                <span>➕</span>
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="admin-product-card">
                {/* Image */}
                <div className="admin-product-card__image">
                  <img
                    src={
                      product.images[0]?.url ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.productName}
                  />
                  <span
                    className={`card-stock-badge ${
                      product.inStock
                        ? "card-stock-badge--in"
                        : "card-stock-badge--out"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Content */}
                <div className="admin-product-card__content">
                  <span className="card-brand">{product.brand}</span>
                  <h3 className="card-title">{product.productName}</h3>

                  <div className="card-meta">
                    <span className="card-meta-tag">{product.cameraType}</span>
                    <span className="card-meta-tag">{product.resolution}</span>
                    {product.warrantyMonths && (
                      <span className="card-meta-tag">
                        {product.warrantyMonths}M Warranty
                      </span>
                    )}
                  </div>

                  <div className="card-price">
                    Rs. {product.price.toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-product-card__actions">
                  <button
                    className="card-action-btn card-action-btn--edit"
                    onClick={() => handleEditClick(product)}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  <button
                    className="card-action-btn card-action-btn--delete"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDeleteModal && selectedProduct && (
        <DeleteConfirmModal
          productName={selectedProduct.productName}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AdminProducts;
