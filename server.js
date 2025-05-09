const express = require('express');
const path = require('path');
const postsRouter = require('./src/routes/posts');
const commentsRouter = require('./src/routes/comments');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

// Handle SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
