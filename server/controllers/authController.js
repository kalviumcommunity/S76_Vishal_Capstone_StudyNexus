// In your register function/method, make sure it uses req.body.fullName, not req.body.username
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Rest of registration logic...

    // When creating a new user, use fullName
    const newUser = new User({
      fullName, // Not username
      email,
      password: hashedPassword,
      // other fields...
    });

    // Rest of code...
  } catch (error) {
    // Log the full error for debugging
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
