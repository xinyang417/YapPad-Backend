const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP server address
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(recipient, subject, text) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS, // render email
      to: recipient, // recipient email
      subject: subject, // email subject
      text: text, // email content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    throw error;
  }
}

module.exports = { transporter, sendEmail };
