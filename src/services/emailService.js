
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  sendEmail: async (to, message) => {
    try {
      await transporter.sendMail({
        from: `"Notification Service" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'New Notification',
        text: message
      });
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }
};
