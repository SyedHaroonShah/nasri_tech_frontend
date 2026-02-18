import { useState } from "react";

const CAMERA_TYPES = [
  "IP Camera",
  "WiFi Camera",
  "PTZ Camera",
  "Dome Camera",
  "Bullet Camera",
];
const RESOLUTIONS = ["2MP", "4MP", "5MP", "8MP", "12MP"];
const BRANDS = ["Hikvision", "Dahua", "CP Plus", "Uniview", "Reolink"];

const FILTER_LABELS = {
  cameraType: "Type",
  resolution: "Resolution",
  brand: "Brand",
  nightVision: "Night Vision",
  inStock: "In Stock",
  minPrice: "Min Price",
  maxPrice: "Max Price",
};

const ProductFilters = ({ onFilter }) => {
  const [local, setLocal] = useState({
    cameraType: "",
    resolution: "",
    brand: "",
    nightVision: "",
    inStock: "",
    minPrice: "",
    maxPrice: "",
  });

  // Active filters passed up to parent (applied after button click)
  const [applied, setApplied] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Strip empty values before sending
    const clean = Object.fromEntries(
      Object.entries(local).filter(([, v]) => v !== ""),
    );
    setApplied(clean);
    onFilter(clean);
  };

  const handleClearChip = (key) => {
    const updated = { ...local, [key]: "" };
    const cleanApplied = { ...applied };
    delete cleanApplied[key];

    setLocal(updated);
    setApplied(cleanApplied);
    onFilter(cleanApplied);
  };

  const handleClearAll = () => {
    const empty = {
      cameraType: "",
      resolution: "",
      brand: "",
      nightVision: "",
      inStock: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocal(empty);
    setApplied({});
    onFilter({});
  };

  const activeKeys = Object.keys(applied);

  const chipLabel = (key) => {
    const v = applied[key];
    if (key === "nightVision")
      return `Night Vision: ${v === "true" ? "Yes" : "No"}`;
    if (key === "inStock")
      return `${v === "true" ? "In Stock" : "Out of Stock"}`;
    if (key === "minPrice") return `Min: Rs. ${Number(v).toLocaleString()}`;
    if (key === "maxPrice") return `Max: Rs. ${Number(v).toLocaleString()}`;
    return `${FILTER_LABELS[key] || key}: ${v}`;
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__top">
        {/* Camera Type */}
        <div className="filter-group">
          <label htmlFor="f-cameraType">Camera Type</label>
          <select
            id="f-cameraType"
            name="cameraType"
            value={local.cameraType}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            {CAMERA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div className="filter-group">
          <label htmlFor="f-resolution">Resolution</label>
          <select
            id="f-resolution"
            name="resolution"
            value={local.resolution}
            onChange={handleChange}
          >
            <option value="">All Resolutions</option>
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="filter-group">
          <label htmlFor="f-brand">Brand</label>
          <select
            id="f-brand"
            name="brand"
            value={local.brand}
            onChange={handleChange}
          >
            <option value="">All Brands</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Night Vision */}
        <div className="filter-group">
          <label htmlFor="f-nightVision">Night Vision</label>
          <select
            id="f-nightVision"
            name="nightVision"
            value={local.nightVision}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* In Stock */}
        <div className="filter-group">
          <label htmlFor="f-inStock">Availability</label>
          <select
            id="f-inStock"
            name="inStock"
            value={local.inStock}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group filter-group--price">
          <label>Price Range (Rs.)</label>
          <div className="price-row">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={local.minPrice}
              onChange={handleChange}
              min="0"
            />
            <span>—</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={local.maxPrice}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="filter-actions">
          <button className="btn-filter" onClick={handleApply} type="button">
            🔍 Filter
          </button>
          {activeKeys.length > 0 && (
            <button
              className="btn-clear"
              onClick={handleClearAll}
              type="button"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeKeys.length > 0 && (
        <div className="filter-chips">
          <span className="filter-chips__label">Active:</span>
          {activeKeys.map((key) => (
            <span
              key={key}
              className="chip"
              onClick={() => handleClearChip(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClearChip(key)}
              aria-label={`Remove filter: ${chipLabel(key)}`}
            >
              {chipLabel(key)}
              <span className="chip__remove">×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
