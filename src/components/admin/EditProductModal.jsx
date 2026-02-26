import { useState } from "react";
import {
  updateProduct,
  updateProductImages,
} from "../../services/admin/products.service";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productId: product.productId || "",
    productName: product.productName || "",
    brand: product.brand || "",
    cameraType: product.cameraType || "",
    resolution: product.resolution || "",
    lensType: product.lensType || "",
    nightVision: product.nightVision || false,
    storageSupport: product.storageSupport || "",
    warrantyMonths: product.warrantyMonths || 12,
    price: product.price || "",
    description: product.description || "",
    inStock: product.inStock !== undefined ? product.inStock : true,
  });

  const [features, setFeatures] = useState(product.features || []);
  const [featureInput, setFeatureInput] = useState("");

  // Images state
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [showImageUpdate, setShowImageUpdate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
    e.target.value = "";
  };

  const addImages = (files) => {
    const remaining = 5 - newImages.length;
    const toAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`You can only upload ${remaining} more image(s). Maximum is 5.`);
    }

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setNewImages((prev) => [...prev, ...toAdd]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    addImages(files);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.brand ||
      !formData.cameraType ||
      !formData.resolution ||
      !formData.price
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        ...formData,
        features: features.length > 0 ? features : [],
      };

      await updateProduct(product._id, updateData);

      // If there are new images, update them separately
      if (showImageUpdate && newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => {
          imageFormData.append("images", image);
        });
        await updateProductImages(product._id, imageFormData);
      }

      onSuccess();
    } catch (error) {
      console.error("Update product error:", error);
      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Product</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdateDetails}>
          <div className="modal-body">
            <div className="modal-form">
              {/* Basic Info */}
              <div className="modal-form-grid">
                <div className="modal-form-group">
                  <label htmlFor="productId">Product ID</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    disabled
                    style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="brand">
                    Brand <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-form-group modal-form-group--full">
                  <label htmlFor="productName">
                    Product Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="cameraType">
                    Camera Type <span className="required-star">*</span>
                  </label>
                  <select
                    id="cameraType"
                    name="cameraType"
                    value={formData.cameraType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="IP">IP Camera</option>
                    <option value="Analog">Analog Camera</option>
                    <option value="WiFi">WiFi Camera</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="resolution">
                    Resolution <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="resolution"
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="lensType">Lens Type</label>
                  <input
                    type="text"
                    id="lensType"
                    name="lensType"
                    value={formData.lensType}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="storageSupport">Storage Support</label>
                  <input
                    type="text"
                    id="storageSupport"
                    name="storageSupport"
                    value={formData.storageSupport}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="warrantyMonths">Warranty (Months)</label>
                  <input
                    type="number"
                    id="warrantyMonths"
                    name="warrantyMonths"
                    min="0"
                    value={formData.warrantyMonths}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="price">
                    Price (Rs.) <span className="required-star">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-form-group modal-form-group--full">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="modal-form-grid">
                <div className="modal-checkbox-group">
                  <input
                    type="checkbox"
                    id="nightVision"
                    name="nightVision"
                    checked={formData.nightVision}
                    onChange={handleChange}
                  />
                  <label htmlFor="nightVision">Night Vision Supported</label>
                </div>

                <div className="modal-checkbox-group">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  <label htmlFor="inStock">In Stock</label>
                </div>
              </div>

              {/* Features */}
              <div className="modal-form-group">
                <label>Features</label>
                <div className="features-input-group">
                  <input
                    type="text"
                    placeholder="Add a feature..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                  />
                  <button
                    type="button"
                    className="btn-add-feature"
                    onClick={handleAddFeature}
                  >
                    + Add
                  </button>
                </div>

                {features.length > 0 && (
                  <div className="features-list">
                    {features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span>{feature}</span>
                        <button
                          type="button"
                          className="btn-remove-feature"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Images */}
              <div className="modal-form-group">
                <label>Current Images</label>
                <div className="image-previews-grid">
                  {product.images?.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img.url} alt={`Current ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-add-feature"
                  onClick={() => setShowImageUpdate(!showImageUpdate)}
                  style={{ marginTop: "12px" }}
                >
                  {showImageUpdate ? "Cancel Update Images" : "Update Images"}
                </button>
              </div>

              {/* New Images Upload */}
              {showImageUpdate && (
                <div className="modal-form-group">
                  <label>New Images (will replace all existing)</label>
                  <div
                    className={`image-upload-zone ${dragActive ? "drag-active" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      newImages.length < 5 &&
                      document.getElementById("newProductImages").click()
                    }
                    style={{
                      cursor: newImages.length >= 5 ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="upload-zone-icon">☁️</div>
                    <p className="upload-zone-text">
                      {newImages.length < 5
                        ? "Click or drag new images"
                        : "Maximum 5 images"}
                    </p>
                    <p className="upload-zone-hint">PNG, JPG up to 5MB each</p>
                    <input
                      type="file"
                      id="newProductImages"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  {newImagePreviews.length > 0 && (
                    <div className="image-previews-grid">
                      {newImagePreviews.map((src, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={src} alt={`New ${index + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveNewImage(index);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
