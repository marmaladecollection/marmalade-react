import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Server-side email sending function
export const sendEmail = async (to, subject, text) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  // Fire and forget - don't await the result
  transporter.sendMail(mailOptions)
    .then(info => console.log('Email sent: ' + info.response))
    .catch(error => console.error('Error sending email:', error));
}; 