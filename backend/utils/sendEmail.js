const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email is not configured: set EMAIL_USER and EMAIL_PASS.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `ShopNest <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

module.exports = sendEmail;
