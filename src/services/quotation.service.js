import apiClient from "../api/apiClient";

/**
 * Submit a quotation request with images
 * @param {FormData} formData - Form data containing all fields and images
 * @returns {Promise} API response data
 */
export const submitQuotationRequest = async (formData) => {
  const response = await apiClient.post("/customer/quotations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

/**
 * Fetch all quotations (if needed for admin later)
 * @returns {Promise} Array of quotations
 */
export const fetchAllQuotations = async () => {
  const response = await apiClient.get("/quotations");
  return response.data.data;
};

/**
 * Fetch quotation by ID (if needed)
 * @param {string} id - Quotation ID
 * @returns {Promise} Quotation data
 */
export const fetchQuotationById = async (id) => {
  const response = await apiClient.get(`/quotations/${id}`);
  return response.data.data;
};
