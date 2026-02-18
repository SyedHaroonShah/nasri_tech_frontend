import apiClient from "../api/apiClient";

export const adminLogin = async (credentials) => {
  const response = await apiClient.post("/admin/login", credentials);
  return response.data;
};
