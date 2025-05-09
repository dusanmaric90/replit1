/**
 * In-memory database for posts and comments
 * This serves as a temporary data store for MVP development
 */

// Initial data store
const db = {
  posts: [],
  lastPostId: 0,
  comments: [],
  lastCommentId: 0
};

// Post functions
const getAllPosts = () => {
  return db.posts;
};

const getPostById = (id) => {
  return db.posts.find(post => post.id === Number(id));
};

const createPost = (postData) => {
  const newId = ++db.lastPostId;
  const newPost = {
    id: newId,
    title: postData.title,
    content: postData.content,
    author: postData.author || 'Anonymous',
    createdAt: new Date().toISOString()
  };
  
  db.posts.push(newPost);
  return newPost;
};

const updatePost = (id, postData) => {
  const postIndex = db.posts.findIndex(post => post.id === Number(id));
  
  if (postIndex === -1) {
    return null;
  }
  
  const updatedPost = {
    ...db.posts[postIndex],
    title: postData.title || db.posts[postIndex].title,
    content: postData.content || db.posts[postIndex].content,
    author: postData.author || db.posts[postIndex].author,
    updatedAt: new Date().toISOString()
  };
  
  db.posts[postIndex] = updatedPost;
  return updatedPost;
};

const deletePost = (id) => {
  const postIndex = db.posts.findIndex(post => post.id === Number(id));
  
  if (postIndex === -1) {
    return false;
  }
  
  // Remove all comments for this post
  db.comments = db.comments.filter(comment => comment.postId !== Number(id));
  
  // Remove the post
  db.posts.splice(postIndex, 1);
  return true;
};

// Comment functions
const getCommentsByPostId = (postId) => {
  return db.comments.filter(comment => comment.postId === Number(postId));
};

const createComment = (commentData) => {
  const newId = ++db.lastCommentId;
  const newComment = {
    id: newId,
    postId: Number(commentData.postId),
    content: commentData.content,
    author: commentData.author || 'Anonymous',
    createdAt: new Date().toISOString()
  };
  
  db.comments.push(newComment);
  return newComment;
};

const updateComment = (id, commentData) => {
  const commentIndex = db.comments.findIndex(comment => comment.id === Number(id));
  
  if (commentIndex === -1) {
    return null;
  }
  
  const updatedComment = {
    ...db.comments[commentIndex],
    content: commentData.content || db.comments[commentIndex].content,
    author: commentData.author || db.comments[commentIndex].author,
    updatedAt: new Date().toISOString()
  };
  
  db.comments[commentIndex] = updatedComment;
  return updatedComment;
};

const deleteComment = (id) => {
  const commentIndex = db.comments.findIndex(comment => comment.id === Number(id));
  
  if (commentIndex === -1) {
    return false;
  }
  
  db.comments.splice(commentIndex, 1);
  return true;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};
