const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: true,                 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    const initBetterAuth = require('./betterAuth');
    await initBetterAuth(app);
  })
  .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/my-tutors', require('./routes/my-tutors'));
app.use('/api/my-bookings', require('./routes/my-bookings'));
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));

app.get('/', (req, res) => res.send('🚀 MediQueue Server Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));