import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminAuth.service";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await adminLogin({ email, password });

      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (!err.response) {
        setError("Unable to connect to server.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card animated">
        {/* Back Button */}
        <button
          className="back-btn"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Shop
        </button>

        {/* Logo */}
        <div className="login-logo">📷 Camera Shop</div>

        <h2>Admin Login</h2>
        <p className="login-subtitle">Access the administration dashboard</p>

        {error && <div className="login-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@camerashop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="admin-password">Password</label>

            <div className="password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
