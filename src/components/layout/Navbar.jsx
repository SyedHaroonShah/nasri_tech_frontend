import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAdminLoggedIn, adminLogout } from "../../utils/adminAuth";
import ConfirmLogoutModal from "../ui/ConfirmLogoutModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    adminLogout();
    setIsAdmin(false);
    navigate("/admin/login", { replace: true });
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar__brand">
          <Link to={isAdmin ? "/admin/dashboard" : "/"}>Camera Shop</Link>
        </div>

        {/* Customer Links */}
        {!isAdmin && (
          <ul className="navbar__links">
            <li>
              <NavLink to="/warranty-claim">Warranty Claim</NavLink>
            </li>
            <li>
              <NavLink to="/quotation-request">Quotation Request</NavLink>
            </li>
          </ul>
        )}

        {/* Right Side - Admin Actions */}
        <div className="navbar__admin">
          {!isAdmin ? (
            <Link to="/admin/login" className="admin-login-btn">
              Admin Login
            </Link>
          ) : (
            <button
              className="admin-logout-btn"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Logout from admin panel"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ConfirmLogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </>
  );
};

export default Navbar;
