const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const clientUrl = process.env.CLIENT_URL || '*';
app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/my-tutors', require('./routes/my-tutors'));
app.use('/api/my-bookings', require('./routes/my-bookings'));
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/oauth-login', require('./routes/oauth-login'));
app.use('/api/verify-token', require('./routes/verify-token'));
app.use('/api/auth', require('./routes/auth-status'));

app.get('/', (req, res) => res.send('🚀 MediQueue Server Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));