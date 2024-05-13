const isValidEmail = (email) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Sri Lankan phone number format
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(?:\+?94|0)?(?:77\d{7})$/;
  return phoneRegex.test(phone);
};

module.exports = { isValidEmail, validatePhoneNumber };
