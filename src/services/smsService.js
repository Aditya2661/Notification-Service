const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  sendSMS: async (to, message) => {
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      return true;
    } catch (error) {
      console.error('SMS send failed:', error);
      return false;
    }
  }
};
