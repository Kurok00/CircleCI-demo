const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Thêm function để đóng server
const closeServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};

module.exports = { app, closeServer };