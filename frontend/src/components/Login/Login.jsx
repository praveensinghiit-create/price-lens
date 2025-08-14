import React, { useState } from "react";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Simple modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://qbittech-3.onrender.com/api/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = response.data;
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      setTimeout(() => {
        onLogin();
      }, 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await axios.post(
        "https://qbittech-3.onrender.com/api/forgot-password",
        { email: forgotEmail },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(
        response.data.message ||
          "If this email is registered, you will receive a password reset link."
      );
      setShowForgot(false);
      setForgotEmail("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to send reset link. Please try again.";
      toast.error(errorMsg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Login"}
          </button>
        </form>
        <div className="forgot-footer">
          <button
            type="button"
            className="forgot-btn"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgot} onClose={() => setShowForgot(false)}>
        <h3>Reset Password</h3>
        <form onSubmit={handleForgotSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={forgotLoading}>
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
