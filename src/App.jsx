import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminRoute from "./pages/Admin/AdminRoute";

import Home from "./pages/Home/Home";
import WarrantyClaim from "./pages/WarrantyClaim";
import QuotationRequest from "./pages/QuotationRequest";
import AdminLogin from "./pages/Admin/AdminLogin";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/warranty-claim" element={<WarrantyClaim />} />
          <Route path="/quotation-request" element={<QuotationRequest />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        {/* ADMIN LOGIN (NO FOOTER) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
