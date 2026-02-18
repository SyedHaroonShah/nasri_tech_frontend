import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn } from "../../utils/adminAuth";
import ProductsSection from "./ProductsSection";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <ProductsSection />
    </>
  );
};

export default Home;
