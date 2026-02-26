import { useState } from "react";
import { createProduct } from "../../services/admin/products.service";

const CreateProductModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    brand: "",
    cameraType: "",
    resolution: "",
    lensType: "",
    nightVision: false,
    storageSupport: "",
    warrantyMonths: 12,
    price: "",
    description: "",
    inStock: true,
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`You can only upload ${remaining} more image(s). Maximum is 5.`);
    }

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...toAdd]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productId ||
      !formData.productName ||
      !formData.brand ||
      !formData.cameraType ||
      !formData.resolution ||
      !formData.price
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Add features as JSON string
      if (features.length > 0) {
        data.append("features", JSON.stringify(features));
      }

      // Add images
      images.forEach((image) => {
        data.append("images", image);
      });

      await createProduct(data);
      onSuccess();
    } catch (error) {
      console.error("Create product error:", error);
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Create New Product</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form">
              {/* Basic Info */}
              <div className="modal-form-grid">
                <div className="modal-form-group">
                  <label htmlFor="productId">
                    Product ID <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    placeholder="e.g., CAM-001"
                    value={formData.productId}
                    onChange={handleChange}
                    required
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
                    placeholder="e.g., Hikvision"
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
                    placeholder="e.g., 4MP IP Dome Camera"
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
                    placeholder="e.g., 4MP, 1080p"
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
                    placeholder="e.g., Fixed, Varifocal"
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
                    placeholder="e.g., MicroSD up to 256GB"
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
                    placeholder="e.g., 15000"
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
                    placeholder="Product description..."
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

              {/* Image Upload */}
              <div className="modal-form-group">
                <label>
                  Product Images <span className="required-star">*</span> (Max
                  5)
                </label>
                <div
                  className={`image-upload-zone ${dragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    images.length < 5 &&
                    document.getElementById("productImages").click()
                  }
                  style={{
                    cursor: images.length >= 5 ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="upload-zone-icon">☁️</div>
                  <p className="upload-zone-text">
                    {images.length < 5
                      ? "Click or drag images here"
                      : "Maximum 5 images uploaded"}
                  </p>
                  <p className="upload-zone-hint">PNG, JPG up to 5MB each</p>
                  <input
                    type="file"
                    id="productImages"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="image-previews-grid">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={src} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
