import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate form
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        console.log("Login successful");
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Rest of component remains the same
    <div className="max-w-md mx-auto my-12 px-8 py-12 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In to StudyNexus</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
        <div className="mb-6">
          <label 
            htmlFor="email" 
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email
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
            Password
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
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-[#00EACC] focus:ring-[#00EACC] border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <Link to="#" className="text-sm text-[#00EACC] hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00EACC] text-black font-medium py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#00EACC] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;