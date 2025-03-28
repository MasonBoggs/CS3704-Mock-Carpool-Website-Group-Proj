const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Example: GET route for a profile page
app.get('/profile', (req, res) => {
  // Render a profile HTML page, or send a placeholder response for testing
  res.send('<h1>Welcome to your profile!</h1>');
});

// POST route to handle the email form
app.post('/send-email', async (req, res) => {
  try {
    const { userEmail, subject, message } = req.body;

    // 1. Create a transporter object (adjust with your actual email service credentials)
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'your-email@example.com',
        pass: 'yourEmailPassword'
      }
    });

    // 2. Set up mail options
    const mailOptions = {
      from: 'your-email@example.com',
      to: userEmail,         // or you might want to email yourself, the user, etc.
      subject: subject,
      text: message
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    // 4. On success, redirect to the profile page
    return res.redirect('/profile');

  } catch (error) {
    // If there's an error, you can show an error message or page
    console.error('Error sending email:', error);
    return res.status(500).send('Error sending email. Please try again later.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
