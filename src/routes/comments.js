const express = require('express');
const router = express.Router();
const db = require('../models/inMemoryDB');

/**
 * POST /api/comments
 * Create a new comment
 */
router.post('/', (req, res) => {
  try {
    const { postId, content, author } = req.body;
    
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }
    
    // Check if the post exists
    const post = db.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${postId} not found` });
    }
    
    const newComment = db.createComment({ postId, content, author });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create comment',
      details: error.message
    });
  }
});

/**
 * PUT /api/comments/:id
 * Update an existing comment
 */
router.put('/:id', (req, res) => {
  try {
    const { content, author } = req.body;
    
    const updatedComment = db.updateComment(req.params.id, { content, author });
    
    if (!updatedComment) {
      return res.status(404).json({ error: `Comment with ID ${req.params.id} not found` });
    }
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update comment',
      details: error.message
    });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment
 */
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteComment(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: `Comment with ID ${req.params.id} not found` });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete comment',
      details: error.message
    });
  }
});

module.exports = router;
