import { Outlet, useLocation, Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../../utils/adminAuth";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
