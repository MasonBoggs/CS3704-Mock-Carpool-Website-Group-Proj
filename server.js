const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '.')));


// In-memory data store (would be replaced with a database in production)
let rides = [
  {
      id: 1,
      driver: "John Doe",
      from: "Newman Library",
      to: "DNDS",
      price: 15,
      seats: 3,
      date: "2025-04-15",
      time: "14:30",
      rating: 4.8,
      gender: "Male",
      major: "Computer Science"
  },
  {
      id: 2,
      driver: "Jane Smith",
      from: "Squires Student Center",
      to: "McBryde",
      price: 20,
      seats: 2,
      date: "2025-04-15",
      time: "16:00",
      rating: 4.6,
      gender: "Female",
      major: "Engineering"
  },
  {
      id: 3,
      driver: "Alex Johnson",
      from: "Lane Stadium",
      to: "Goodwin Hall",
      price: 18,
      seats: 4,
      date: "2025-04-16",
      time: "09:15",
      rating: 4.9,
      gender: "Non-binary",
      major: "Business"
  }
];


// Routes for static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/carpool', (req, res) => {
  res.sendFile(path.join(__dirname, 'carpool.html'));
});

// API Routes for Rides
// Get all rides
app.get('/api/rides', (req, res) => {
  res.json(rides);
});

// Get a specific ride
app.get('/api/rides/:id', (req, res) => {
  const ride = rides.find(r => r.id === parseInt(req.params.id));
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(ride);
});

// Create a new ride
app.post('/api/rides', (req, res) => {
  const newId = Math.max(...rides.map(ride => ride.id), 0) + 1;
  const newRide = {
      id: newId,
      ...req.body
  };
  
  rides.push(newRide);
  res.status(201).json(newRide);
});

// Update a ride
app.put('/api/rides/:id', (req, res) => {
  const rideId = parseInt(req.params.id);
  const rideIndex = rides.findIndex(r => r.id === rideId);
  
  if (rideIndex === -1) {
      return res.status(404).json({ message: 'Ride not found' });
  }
  
  const updatedRide = {
      ...rides[rideIndex],
      ...req.body,
      id: rideId // Ensure ID doesn't change
  };
  
  rides[rideIndex] = updatedRide;
  res.json(updatedRide);
});

// Delete a ride
app.delete('/api/rides/:id', (req, res) => {
  const rideId = parseInt(req.params.id);
  const rideIndex = rides.findIndex(r => r.id === rideId);
  
  if (rideIndex === -1) {
      return res.status(404).json({ message: 'Ride not found' });
  }
  
  rides.splice(rideIndex, 1);
  res.json({ message: 'Ride deleted successfully' });
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
