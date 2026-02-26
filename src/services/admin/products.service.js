import apiClient from "../../api/apiClient";

/**
 * Fetch all products (Admin)
 * @returns {Promise} Array of products
 */
export const fetchAllAdminProducts = async () => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.get("/admin/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

/**
 * Create a new product
 * @param {FormData} formData - Product data with images
 * @returns {Promise} Created product
 */
export const createProduct = async (formData) => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.post("/admin/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

/**
 * Update product details (without images)
 * @param {string} productId - Product ID
 * @param {Object} data - Product data to update
 * @returns {Promise} Updated product
 */
export const updateProduct = async (productId, data) => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.put(`/admin/products/${productId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

/**
 * Update product images only
 * @param {string} productId - Product ID
 * @param {FormData} formData - Form data with new images
 * @returns {Promise} Updated product
 */
export const updateProductImages = async (productId, formData) => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.patch(
    `/admin/products/${productId}/images`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise} Success response
 */
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.delete(`/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Filter products (Admin)
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Filtered products
 */
export const filterAdminProducts = async (filters) => {
  const token = localStorage.getItem("adminToken");
  const query = new URLSearchParams(filters).toString();
  const response = await apiClient.get(`/admin/products/filter?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

/**
 * Fetch single product by ID (Admin)
 * @param {string} productId - Product ID
 * @returns {Promise} Product data
 */
export const fetchProductByIdAdmin = async (productId) => {
  const token = localStorage.getItem("adminToken");
  const response = await apiClient.get(`/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
