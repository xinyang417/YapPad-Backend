/// DISCLOSURE: the following JavaScript code has been created with the aid of 
// Chat GPT 3.5 and edited by Group 6. 

const User = require("../models/user_model");
const { sendEmail } = require("./email_service");
const { hashPassword } = require("./user_service");

class TokenManager {
  constructor() {
    if (TokenManager._instance) {
      return TokenManager._instance;
    }

    this._token_store = new Map()
    TokenManager._instance = this;
  }

  registerToken(email, token) {
    this._token_store.set(email, token)
  }

  unregisterToken(email) {
    this._token_store.delete(email)
  }

  isValidToken(email, token) {
    if (!this._token_store.has(email)) {
      return false
    }

    return this._token_store.get(email) === token
  }

  static generateResetToken() {
    return Math.random().toString(36).slice(2);
  }
}


// handle password reset request
async function handlePasswordResetRequest(email) {
  try {
    const tokenManager = new TokenManager()
    const resetToken = TokenManager.generateResetToken();
    tokenManager.registerToken(email, resetToken)

    await sendEmail(
      email,
      "Reset Your YapPad Password",
      `Forgot your password? Click the following link to reset your password: 
      ${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`
    );

    return "Password reset email sent successfully";
  } catch (error) {
    throw error;
  }
}

async function resetPassword(email, token, pass) {
  try {
    const tokenManager = new TokenManager()
    if (tokenManager.isValidToken(email, token)) {
      const user = await User.findOne({ email })
      user.password = await hashPassword(pass)
      await user.save()
    } else {
      throw "Invalid token for email"
    }
  } catch (e) {
    throw e;
  }
}

module.exports = { handlePasswordResetRequest, resetPassword };
