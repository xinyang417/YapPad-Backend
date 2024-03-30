const { sendEmail } = require("./email_service");

// generate a random reset token
function generateResetToken() {
  return Math.random().toString(36).slice(2);
}

// handle password reset request
async function handlePasswordResetRequest(email) {
  try {
    const resetToken = generateResetToken();

    await sendEmail(
      email,
      "Reset Your YapPad Password",
      `Forgot your password? Click the following link to reset your password: 
      http://localhost:8000/auth/reset-password?email=${email}&token=${resetToken}`
    );

    return "Password reset email sent successfully";
  } catch (error) {
    throw error;
  }
}

module.exports = { handlePasswordResetRequest };
