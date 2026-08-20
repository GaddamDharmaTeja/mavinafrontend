import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin } from "../services/productService";
import "./AdminRegister.css";

export default function AdminRegister() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const token = await registerAdmin(form);
      localStorage.setItem("admin_session", "active");
      localStorage.setItem("admin_email", token.email);
      navigate("/admin");
    } catch (error) {
      setMessage(error.message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="admin-auth-page">

      <div className="auth-card">

        <div className="logo">
          <h1>Maviina Mane</h1>
          <span>Admin Registration</span>
        </div>

        <h2>Create Admin Account</h2>

        <p>Create a new administrator account</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="8"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          {message && <p className="register-message">{message}</p>}

        </form>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/admin/login">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}
