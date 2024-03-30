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
      "Reset Your Password",
      `To reset your password, click the following link: http://localhost:8000/auth/reset-password?email=${email}&token=${resetToken}`
    );

    return "Password reset email sent successfully";
  } catch (error) {
    throw error;
  }
}

module.exports = { handlePasswordResetRequest };
