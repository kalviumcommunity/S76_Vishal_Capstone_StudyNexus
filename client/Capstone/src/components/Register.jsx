import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update handleSubmit function to add password validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Check password format - only letters and numbers allowed
    const passwordRegex = /^[a-zA-Z0-9]{6,30}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage(
        "Password must contain only letters and numbers (no special characters)"
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.password
      );

      console.log("Registration result:", result);

      if (result.success) {
        // Registration successful, navigate to dashboard
        navigate("/dashboard");
      } else {
        // Show the specific error message from the backend
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Rest of component remains the same
  return (
    <div className="max-w-md mx-auto my-12 px-8 py-12 bg-white rounded-lg shadow-lg">
      {/* Component JSX remains unchanged */}
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Username*
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00EACC]"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00EACC]"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Password*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00EACC]"
            placeholder="••••••••"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters, containing only letters and
            numbers (no special characters)
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Confirm Password*
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00EACC]"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00EACC] text-black font-medium py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00EACC] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
