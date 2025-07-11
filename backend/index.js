// backend/server.js

const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables before anything else
dotenv.config({ path: './.env' });

const app = require('./app');
const connectDB = require('./config/db');

// Connect to the MongoDB database
connectDB();

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Make the `io` instance accessible globally in our app via the `req` object
// This allows us to emit events from our controllers after an API request.
app.set('io', io);

// Set up a listener for new client connections
io.on('connection', (socket) => {
  console.log(`Socket.IO Client Connected: ${socket.id}`);

  // Optional: Join a room for admins to receive notifications
  // This is useful for targeting specific clients.
  socket.on('joinAdminRoom', () => {
    socket.join('admin-room');
    console.log(`Client ${socket.id} joined the admin room.`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket.IO Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close the server and exit the process
  server.close(() => process.exit(1));
});
