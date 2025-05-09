// Post-related functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const postsList = document.getElementById('posts-list');
    const postsEmptyState = document.getElementById('posts-empty-state');
    const postDetail = document.getElementById('post-detail');
    const postForm = document.getElementById('post-form');
    
    // Load all posts
    window.loadAllPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
            }
            
            const posts = await response.json();
            renderPostsList(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
            showError('Failed to load posts. Please try again later.');
        }
    };
    
    // Load a specific post's details
    window.loadPostDetails = async (postId) => {
        try {
            // Fetch post
            const postResponse = await fetch(`/api/posts/${postId}`);
            
            if (!postResponse.ok) {
                throw new Error(`HTTP error ${postResponse.status}: ${await postResponse.text()}`);
            }
            
            const post = await postResponse.json();
            
            // Fetch comments for this post
            const commentsResponse = await fetch(`/api/posts/${postId}/comments`);
            
            if (!commentsResponse.ok) {
                throw new Error(`HTTP error ${commentsResponse.status}: ${await commentsResponse.text()}`);
            }
            
            const comments = await commentsResponse.json();
            
            // Store the current post ID in a data attribute for comments functionality
            postDetail.dataset.postId = postId;
            
            // Render post details and comments
            renderPostDetail(post);
            renderComments(comments);
        } catch (error) {
            console.error('Error loading post details:', error);
            showError('Failed to load post details. Please try again later.');
        }
    };
    
    // Render the list of posts
    const renderPostsList = (posts) => {
        postsList.innerHTML = '';
        
        if (posts.length === 0) {
            postsEmptyState.classList.remove('d-none');
            return;
        }
        
        postsEmptyState.classList.add('d-none');
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'col-md-6 col-lg-4 mb-4';
            postCard.innerHTML = `
                <div class="card post-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(post.title)}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">By ${escapeHtml(post.author)}</h6>
                        <p class="card-text">${escapeHtml(truncateText(post.content, 150))}</p>
                    </div>
                    <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
                        <small class="text-muted">${formatDate(post.createdAt)}</small>
                        <div class="post-actions">
                            <button class="btn btn-sm btn-outline-primary view-post-btn" data-post-id="${post.id}">
                                <i data-feather="eye"></i> View
                            </button>
                            <button class="btn btn-sm btn-outline-secondary edit-post-btn" data-post-id="${post.id}">
                                <i data-feather="edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-post-btn" data-post-id="${post.id}">
                                <i data-feather="trash-2"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            postsList.appendChild(postCard);
            
            // Setup event listeners for post actions
            const viewBtn = postCard.querySelector('.view-post-btn');
            const editBtn = postCard.querySelector('.edit-post-btn');
            const deleteBtn = postCard.querySelector('.delete-post-btn');
            
            viewBtn.addEventListener('click', () => {
                showPostDetailView(post.id);
            });
            
            editBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/api/posts/${post.id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                    }
                    const postData = await response.json();
                    showEditPostView(postData);
                } catch (error) {
                    console.error('Error loading post for editing:', error);
                    showError('Failed to load post for editing.');
                }
            });
            
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                    try {
                        const response = await fetch(`/api/posts/${post.id}`, {
                            method: 'DELETE'
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                        }
                        
                        loadAllPosts(); // Refresh the posts list
                    } catch (error) {
                        console.error('Error deleting post:', error);
                        showError('Failed to delete post.');
                    }
                }
            });
        });
        
        // Redraw Feather icons
        feather.replace();
    };
    
    // Render a single post's details
    const renderPostDetail = (post) => {
        postDetail.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="card-title">${escapeHtml(post.title)}</h3>
                    <h6 class="card-subtitle mb-3 text-muted">By ${escapeHtml(post.author)} on ${formatDate(post.createdAt)}</h6>
                    <p class="card-text">${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-outline-secondary btn-sm me-2 edit-detail-post-btn">
                            <i data-feather="edit"></i> Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-detail-post-btn">
                            <i data-feather="trash-2"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup event listeners for edit and delete buttons
        const editBtn = postDetail.querySelector('.edit-detail-post-btn');
        const deleteBtn = postDetail.querySelector('.delete-detail-post-btn');
        
        editBtn.addEventListener('click', () => {
            showEditPostView(post);
        });
        
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                try {
                    const response = await fetch(`/api/posts/${post.id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                    }
                    
                    showPostsView(); // Go back to posts list
                } catch (error) {
                    console.error('Error deleting post:', error);
                    showError('Failed to delete post.');
                }
            }
        });
        
        // Redraw Feather icons
        feather.replace();
    };
    
    // Setup event listeners for post operations
    window.setupPostOperations = () => {
        // Handle post form submission (create or update)
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const postId = document.getElementById('post-id').value;
            const title = document.getElementById('post-title').value;
            const author = document.getElementById('post-author').value || 'Anonymous';
            const content = document.getElementById('post-content').value;
            
            const postData = { title, author, content };
            
            try {
                let response;
                
                if (postId) {
                    // Update existing post
                    response = await fetch(`/api/posts/${postId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postData)
                    });
                } else {
                    // Create new post
                    response = await fetch('/api/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postData)
                    });
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                }
                
                const savedPost = await response.json();
                
                // Navigate to post detail view for the saved post
                showPostDetailView(savedPost.id);
            } catch (error) {
                console.error('Error saving post:', error);
                showError('Failed to save post. Please try again.');
            }
        });
    };
    
    // Helper functions
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };
});
