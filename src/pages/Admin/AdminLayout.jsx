import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const AdminLayout = () => {
  return (
    <div className="admin-wrapper">
      {/* Admin Navbar */}
      <Navbar />

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h2 className="admin-title">Admin Panel</h2>

          <nav className="admin-nav">
            <NavLink to="/admin/dashboard">Dashboard</NavLink>

            <NavLink to="/admin/products">Products</NavLink>

            <NavLink to="/admin/quotations">Quotation Requests</NavLink>

            <NavLink to="/admin/warranty">Warranty</NavLink>
          </nav>
        </aside>

        {/* Main */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
