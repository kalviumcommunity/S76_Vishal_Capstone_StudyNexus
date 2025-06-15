import axios from "axios";

// Make sure this URL matches your backend server
const API_URL = "http://localhost:5000/api/auth";

// Get the currently logged in user from local storage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

// Login user with API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.success) {
      const userData = response.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Login error:", error);

    // Better error handling for login
    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || "Login failed",
      };
    }

    return {
      success: false,
      message: "Server error. Please try again later.",
    };
  }
};

// Register user with API
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      fullName: username,
      email,
      password,
    });

    if (response.data.success) {
      const userData = response.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return {
      success: false,
      message: response.data.message || "Registration failed",
    };
  } catch (error) {
    console.error("Register API error:", error);

    if (error.response?.data) {
      console.log("Full error response:", error.response.data);

      // If there are specific validation errors, format them for display
      if (error.response.data.errors) {
        // Convert errors object to readable message
        const errorMessages = Object.values(error.response.data.errors).join(
          ", "
        );
        return { success: false, message: errorMessages };
      }

      return {
        success: false,
        message: error.response.data.message || "Registration failed",
      };
    }

    return {
      success: false,
      message: "Server error. Please try again later.",
    };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("user");
  return { success: true };
};

// Export aliases for backward compatibility
export const loginUser = login;
export const registerUser = register;
export const logoutUser = logout;
