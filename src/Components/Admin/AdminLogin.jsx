import { useState } from "react";
import PropTypes from "prop-types";
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, Sparkles, KeyRound } from "lucide-react";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (!cleanPin) {
      setError("Please enter your PIN");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await onLogin(cleanPin);
      setIsSubmitting(false);

      if (result?.success) {
        localStorage.setItem("adminPin", cleanPin);
      } else {
        setError(result?.message || "Incorrect PIN code. Default is 1234.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.message || "Login failed. Please check backend connection.");
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-backdrop" />
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <Sparkles size={16} />
            <span>Admin Control Panel</span>
          </div>
          <div className="admin-login-icon">
            <Lock size={32} />
          </div>
          <h1 className="admin-login-title">Portfolio Studio</h1>
          <p className="admin-login-desc">
            Enter your secret security PIN to access the dashboard and customize your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-pin-group">
            <label htmlFor="admin-pin-input" className="admin-pin-label">
              <KeyRound size={16} />
              <span>Security PIN</span>
            </label>

            <div className="admin-pin-input-wrapper">
              <input
                id="admin-pin-input"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter 4-digit PIN"
                autoFocus
                maxLength={20}
                className={`admin-pin-input ${error ? "has-error" : ""}`}
              />
              <button
                type="button"
                className="pin-visibility-btn"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="admin-pin-error">{error}</p>}
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Verifying...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Unlock Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="back-to-portfolio-link">
            ← Return to Live Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AdminLogin;