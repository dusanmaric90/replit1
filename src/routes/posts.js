const express = require('express');
const router = express.Router();
const db = require('../models/inMemoryDB');

/**
 * GET /api/posts
 * Get all posts
 */
router.get('/', (req, res) => {
  try {
    const posts = db.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve posts',
      details: error.message
    });
  }
});

/**
 * GET /api/posts/:id
 * Get a specific post by ID
 */
router.get('/:id', (req, res) => {
  try {
    const post = db.getPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve post',
      details: error.message
    });
  }
});

/**
 * POST /api/posts
 * Create a new post
 */
router.post('/', (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const newPost = db.createPost({ title, content, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create post',
      details: error.message
    });
  }
});

/**
 * PUT /api/posts/:id
 * Update an existing post
 */
router.put('/:id', (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    const updatedPost = db.updatePost(req.params.id, { title, content, author });
    
    if (!updatedPost) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update post',
      details: error.message
    });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post
 */
router.delete('/:id', (req, res) => {
  try {
    const success = db.deletePost(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete post',
      details: error.message
    });
  }
});

/**
 * GET /api/posts/:id/comments
 * Get all comments for a specific post
 */
router.get('/:id/comments', (req, res) => {
  try {
    const post = db.getPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    const comments = db.getCommentsByPostId(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve comments',
      details: error.message
    });
  }
});

module.exports = router;
