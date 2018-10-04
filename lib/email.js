const nodemailer = require('nodemailer');

// set up transporter to have fortune cookie email access
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.ACCOUNT_USER,
    pass: process.env.ACCOUNT_PASS
  }
});

module.exports = transporter;