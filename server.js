const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Example route that handles form submissions
app.post('/send-email', async (req, res) => {
  try {
    // 1) Extract data from the request body (e.g., user’s email, message, etc.)
    const { userEmail, subject, message } = req.body;

    // 2) Create a transporter (using Gmail example, but you can use any SMTP server)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourgmail@gmail.com',
        pass: 'YOUR_GMAIL_APP_PASSWORD',
      },
    });

    // 3) Set up the mail options
    const mailOptions = {
      from: 'yourgmail@gmail.com',
      to: userEmail,
      subject: subject,
      text: message,
    };

    // 4) Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
