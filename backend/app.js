
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedDevOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const frontendOrigin = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*';


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = frontendOrigin ? [frontendOrigin, ...allowedDevOrigins] : allowedDevOrigins;
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


let reportRoutes;
try {
  reportRoutes = require('./routes/reports');
  app.use('/api/reports', reportRoutes);
  console.log(' Reports routes loaded');
} catch (error) {
  console.error(' Error loading routes:', error.message);
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

app.use(errorHandler);

module.exports = app;