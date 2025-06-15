import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, signInWithGoogle } = useAuth(); // Add signInWithGoogle
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Add loading state for Google

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Google sign-in handler with improved error handling
  const handleGoogleSignIn = async (useRedirect = false) => {
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      const success = await signInWithGoogle(useRedirect);

      if (success) {
        console.log("Google signup successful");
        navigate("/dashboard");
      } else {
        setErrorMessage("Google sign-in failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // Show user-friendly error message
      if (error.message.includes("popup")) {
        setErrorMessage(error.message + " You can try the redirect option below.");
      } else {
        setErrorMessage(error.message || "Failed to sign in with Google");
      }
    } finally {
      setGoogleLoading(false);
    }
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
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Google Sign Up Button - With Google's official colors */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4285F4] mb-6"
      >
        {/* Google's official colored logo */}
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {googleLoading ? "Signing up..." : "Sign up with Google"}
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or register with email
          </span>
        </div>
      </div>

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