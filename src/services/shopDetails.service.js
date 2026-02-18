import apiClient from "../api/apiClient";

export const fetchShopDetails = async () => {
  const response = await apiClient.get("/shopDetails");
  return response.data.data;
};
