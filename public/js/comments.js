// Comment-related functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const commentsList = document.getElementById('comments-list');
    const commentsEmptyState = document.getElementById('comments-empty-state');
    const commentForm = document.getElementById('comment-form');
    
    // Render comments for a post
    window.renderComments = (comments) => {
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsEmptyState.classList.remove('d-none');
            return;
        }
        
        commentsEmptyState.classList.add('d-none');
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment mb-3 p-3 bg-light rounded';
            commentElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <span class="comment-author">${escapeHtml(comment.author)}</span>
                        <span class="comment-date ms-2">${formatDate(comment.createdAt)}</span>
                    </div>
                    <div class="comment-actions">
                        <button class="btn btn-sm btn-outline-danger delete-comment-btn" data-comment-id="${comment.id}">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="comment-content">
                    ${escapeHtml(comment.content).replace(/\n/g, '<br>')}
                </div>
            `;
            
            commentsList.appendChild(commentElement);
            
            // Setup event listener for delete button
            const deleteBtn = commentElement.querySelector('.delete-comment-btn');
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this comment?')) {
                    try {
                        const response = await fetch(`/api/comments/${comment.id}`, {
                            method: 'DELETE'
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                        }
                        
                        // Reload post details to refresh comments
                        const postId = document.getElementById('post-detail').dataset.postId;
                        loadPostDetails(postId);
                    } catch (error) {
                        console.error('Error deleting comment:', error);
                        showError('Failed to delete comment.');
                    }
                }
            });
        });
        
        // Redraw Feather icons
        feather.replace();
    };
    
    // Setup event listeners for comment operations
    window.setupCommentOperations = () => {
        // Handle comment form submission
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const postId = document.getElementById('post-detail').dataset.postId;
            const author = document.getElementById('comment-author').value || 'Anonymous';
            const content = document.getElementById('comment-content').value;
            
            if (!content.trim()) {
                showError('Comment content cannot be empty.');
                return;
            }
            
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        postId,
                        author,
                        content
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                }
                
                // Reset the entire form
                commentForm.reset();
                
                // Reload comments
                loadPostDetails(postId);
            } catch (error) {
                console.error('Error adding comment:', error);
                showError('Failed to add comment. Please try again.');
            }
        });
    };
    
    // Helper functions
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString(undefined, options);
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
