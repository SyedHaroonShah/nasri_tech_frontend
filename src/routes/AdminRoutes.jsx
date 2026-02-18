import { Routes, Route } from "react-router-dom";

import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import Products from "../pages/Admin/Products";
import WarrantyRecords from "../pages/Admin/WarrantyRecords";
import WarrantyClaims from "../pages/Admin/WarrantyClaims";
import Quotations from "../pages/Admin/Quotations";
import ShopDetails from "../pages/Admin/ShopDetails";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/warranties" element={<WarrantyRecords />} />
      <Route path="/admin/claims" element={<WarrantyClaims />} />
      <Route path="/admin/quotations" element={<Quotations />} />
      <Route path="/admin/shop-details" element={<ShopDetails />} />
    </Routes>
  );
};

export default AdminRoutes;
