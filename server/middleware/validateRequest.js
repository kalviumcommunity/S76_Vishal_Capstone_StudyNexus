// Middleware for validating request body against Joi schemas
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (!error) {
      next();
    } else {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      // Log the specific validation errors on the server
      console.log("Validation errors:", errors);

      res.status(400).json({
        success: false,
        message: Object.values(errors).join(", "), // Include all error messages in the top-level message
        errors,
      });
    }
  };
};

module.exports = validateRequest;
