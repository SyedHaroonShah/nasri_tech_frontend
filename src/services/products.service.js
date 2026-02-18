import apiClient from "../api/apiClient";

export const fetchAllProducts = async () => {
  const response = await apiClient.get("/customer/products");
  return response.data.data;
};

export const filterProducts = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const response = await apiClient.get(`/customer/products/filter?${query}`);
  return response.data.data;
};

export const fetchProductById = async (id) => {
  const response = await apiClient.get(`/customer/products/${id}`);
  return response.data.data;
};
