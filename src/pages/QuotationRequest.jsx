import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitQuotationRequest } from "../services/quotation.service.js";

const QuotationRequest = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    serviceType: "",
    cameraType: "",
    quantity: 1,
    description: "",
    location: "",
    preferredContactMethod: "Call",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Handle text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
    // Reset the input value so same file can be selected again if removed
    e.target.value = "";
  };

  const addImages = (files) => {
    const remaining = 3 - images.length;
    const toAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`You can only upload ${remaining} more image(s). Maximum is 3.`);
    }

    // Create previews
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...toAdd]);
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    addImages(files);
  };

  // Handle click on upload area - only open file dialog if under limit
  const handleUploadAreaClick = () => {
    if (images.length < 3) {
      document.getElementById("imageInput").click();
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const data = new FormData();

      // Append text fields (skip empty values)
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((image) => {
        data.append("images", image);
      });

      // Submit via service
      await submitQuotationRequest(data);

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error.message ||
          "Failed to submit quotation request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      email: "",
      serviceType: "",
      cameraType: "",
      quantity: 1,
      description: "",
      location: "",
      preferredContactMethod: "Call",
    });
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    setShowSuccess(false);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="quotation-page">
      <div className="quotation-container">
        {/* Header */}
        <div className="quotation-header">
          <span className="quotation-header__icon">💬</span>
          <h1>Request a Quotation</h1>
          <p>
            Fill out the form below and we'll get back to you with a
            personalized quote for your camera needs.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="quotation-form-card">
          {/* === CUSTOMER INFORMATION === */}
          <div className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">👤</div>
              <h3 className="form-section__title">Your Information</h3>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className={`form-input ${errors.customerName ? "error" : ""}`}
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={handleChange}
                />
                {errors.customerName && (
                  <span className="error-message">
                    ⚠️ {errors.customerName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={`form-input ${errors.phoneNumber ? "error" : ""}`}
                  placeholder="+92 300 1234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <span className="error-message">⚠️ {errors.phoneNumber}</span>
                )}
              </div>

              <div className="form-group form-group--full">
                <label htmlFor="email">
                  Email Address <span className="optional-tag">Optional</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="error-message">⚠️ {errors.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* === SERVICE DETAILS === */}
          <div className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">🛠️</div>
              <h3 className="form-section__title">Service Details</h3>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="serviceType">
                  Service Type <span className="required-star">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  className={`form-select ${errors.serviceType ? "error" : ""}`}
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>
                  <option value="Selling">Selling</option>
                  <option value="Installation">Installation</option>
                  <option value="Troubleshooting">Troubleshooting</option>
                </select>
                {errors.serviceType && (
                  <span className="error-message">⚠️ {errors.serviceType}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cameraType">
                  Camera Type <span className="optional-tag">Optional</span>
                </label>
                <select
                  id="cameraType"
                  name="cameraType"
                  className="form-select"
                  value={formData.cameraType}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="IP">IP Camera</option>
                  <option value="Analog">Analog Camera</option>
                  <option value="WiFi">WiFi Camera</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity <span className="optional-tag">Optional</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className={`form-input ${errors.quantity ? "error" : ""}`}
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && (
                  <span className="error-message">⚠️ {errors.quantity}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Location <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-input ${errors.location ? "error" : ""}`}
                  placeholder="Karachi, Sindh"
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <span className="error-message">⚠️ {errors.location}</span>
                )}
              </div>

              <div className="form-group form-group--full">
                <label htmlFor="description">
                  Description / Requirements{" "}
                  <span className="optional-tag">Optional</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  placeholder="Describe your requirements, issues, or any specific details..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* === IMAGE UPLOAD === */}
          <div className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">📸</div>
              <h3 className="form-section__title">
                Upload Images{" "}
                <span className="optional-tag">Optional · Max 3</span>
              </h3>
            </div>

            <div
              className={`image-upload-area ${dragOver ? "drag-over" : ""} ${images.length >= 3 ? "disabled" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadAreaClick}
              style={{ cursor: images.length >= 3 ? "not-allowed" : "pointer" }}
            >
              <span className="upload-icon">☁️</span>
              <p className="upload-text">
                {images.length < 3
                  ? "Click to upload or drag & drop"
                  : "Maximum 3 images uploaded"}
              </p>
              <p className="upload-hint">PNG, JPG up to 5MB each</p>
              <input
                type="file"
                id="imageInput"
                className="file-input"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 3}
                style={{ display: "none" }}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="image-preview-card">
                    <img src={src} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === CONTACT PREFERENCE === */}
          <div className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">📞</div>
              <h3 className="form-section__title">Preferred Contact Method</h3>
            </div>

            <div className="contact-methods">
              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="Call"
                  checked={formData.preferredContactMethod === "Call"}
                  onChange={handleChange}
                />
                <span className="method-icon">📞</span>
                <span>Phone Call</span>
              </label>

              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="WhatsApp"
                  checked={formData.preferredContactMethod === "WhatsApp"}
                  onChange={handleChange}
                />
                <span className="method-icon">💬</span>
                <span>WhatsApp</span>
              </label>
            </div>
          </div>

          {/* === SUBMIT === */}
          <div className="submit-section">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-submit__icon">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="btn-submit__icon">📤</span>
                  Submit Quotation Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* === SUCCESS MODAL === */}
      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <span className="success-icon">✅</span>
            <h2>Request Submitted!</h2>
            <p>
              Thank you! Your quotation request has been received. We'll contact
              you soon via your preferred method.
            </p>
            <div className="success-modal__actions">
              <button
                type="button"
                className="btn-success-primary"
                onClick={handleGoHome}
              >
                Back to Home
              </button>
              <button
                type="button"
                className="btn-success-secondary"
                onClick={handleReset}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationRequest;
