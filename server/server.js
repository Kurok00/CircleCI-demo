const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Note = require('./models/Note');
require('dotenv').config();

// Configure mongoose
mongoose.set('strictQuery', false);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://note-app-frontend.onrender.com', // Thêm domain frontend trên Render
    'https://circleci-demo-frontend.onrender.com', // Thêm domain frontend mới
    'https://circleci-demo-1.onrender.com', // Thêm domain frontend mới
    '*' // Tạm thời cho phép tất cả origins trong quá trình development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Modified mongoose connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_PROD_URI 
      : process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB:', process.env.NODE_ENV);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Only connect if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// CRUD APIs for notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ created: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content
    });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World! test 1nd' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Add API documentation endpoint
app.get('/api/docs', (req, res) => {
  const apiDocs = {
    name: 'Note App API Documentation',
    version: '1.0.0',
    baseUrl: 'https://circleci-demo.onrender.com',
    endpoints: [
      {
        path: '/',
        method: 'GET',
        description: 'Welcome message'
      },
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint'
      },
      {
        path: '/api/status',
        method: 'GET',
        description: 'API status with timestamp'
      },
      {
        path: '/api/notes',
        method: 'GET',
        description: 'Get all notes'
      },
      {
        path: '/api/notes',
        method: 'POST',
        description: 'Create a new note',
        body: {
          title: 'string (required)',
          content: 'string (required)'
        }
      },
      {
        path: '/api/notes/:id',
        method: 'PUT',
        description: 'Update a note by ID',
        body: {
          title: 'string (required)',
          content: 'string (required)'
        }
      },
      {
        path: '/api/notes/:id',
        method: 'DELETE',
        description: 'Delete a note by ID'
      },
      {
        path: '/webhook/circle-ci',
        method: 'POST',
        description: 'CircleCI webhook endpoint'
      },
      {
        path: '/api/docs',
        method: 'GET',
        description: 'This API documentation'
      }
    ]
  };

  res.json(apiDocs);
});

// Add webhook endpoint handler
app.post('/webhook/circle-ci', (req, res) => {
  const { outcome, build_num, reponame } = req.body;
  
  console.log(`Received CircleCI webhook: ${outcome} for build #${build_num} of ${reponame}`);
  
  // Handle the webhook notification
  // You can add more logic here if needed
  
  res.status(200).json({ 
    message: 'Webhook received',
    outcome,
    build: build_num,
    repo: reponame
  });
});

// Thêm error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Log khi server start
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Thêm function để đóng server
const closeServer = async () => {
  try {
    await mongoose.connection.close();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
};

module.exports = { app, closeServer, connectDB };