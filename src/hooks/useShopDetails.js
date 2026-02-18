import { useEffect, useState } from "react";
import { fetchShopDetails } from "../services/shopDetails.service";

const useShopDetails = () => {
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShopDetails = async () => {
      try {
        const data = await fetchShopDetails();
        setShopDetails(data);
      } catch (error) {
        console.error("Failed to load shop details", error);
      } finally {
        setLoading(false);
      }
    };

    loadShopDetails();
  }, []);

  return { shopDetails, loading };
};

export default useShopDetails;
