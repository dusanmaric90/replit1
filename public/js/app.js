// Main application controller
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    feather.replace();
    
    // Initialize Bootstrap components
    const toastEl = document.getElementById('error-toast');
    const errorToast = new bootstrap.Toast(toastEl);
    
    // Navigation elements
    const homeLink = document.getElementById('home-link');
    const createPostLink = document.getElementById('create-post-link');
    const backToPostsBtn = document.getElementById('back-to-posts-btn');
    const backFromPostFormBtn = document.getElementById('back-from-post-form-btn');
    
    // View containers
    const postsContainer = document.getElementById('posts-container');
    const postDetailContainer = document.getElementById('post-detail-container');
    const postFormContainer = document.getElementById('post-form-container');
    
    // Initialize the application
    const init = () => {
        // Load all posts initially
        loadAllPosts();
        
        // Setup event listeners for navigation
        setupNavigation();
        
        // Setup event listeners for post operations
        setupPostOperations();
        
        // Setup event listeners for comment operations
        setupCommentOperations();
    };
    
    // Setup navigation event listeners
    const setupNavigation = () => {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPostsView();
        });
        
        createPostLink.addEventListener('click', (e) => {
            e.preventDefault();
            showCreatePostView();
        });
        
        backToPostsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPostsView();
        });
        
        backFromPostFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPostsView();
        });
    };
    
    // View switching functions - making them global
    window.showPostsView = () => {
        postsContainer.classList.remove('d-none');
        postDetailContainer.classList.add('d-none');
        postFormContainer.classList.add('d-none');
        
        // Refresh posts list
        loadAllPosts();
        
        // Update active nav link
        setActiveNavLink(homeLink);
    };
    
    window.showPostDetailView = (postId) => {
        postsContainer.classList.add('d-none');
        postDetailContainer.classList.remove('d-none');
        postFormContainer.classList.add('d-none');
        
        // Load post details
        loadPostDetails(postId);
        
        // Update active nav link
        setActiveNavLink(homeLink);
    };
    
    window.showCreatePostView = () => {
        postsContainer.classList.add('d-none');
        postDetailContainer.classList.add('d-none');
        postFormContainer.classList.remove('d-none');
        
        // Reset form
        document.getElementById('post-form-title').textContent = 'Create New Post';
        document.getElementById('post-form').reset();
        document.getElementById('post-id').value = '';
        
        // Update active nav link
        setActiveNavLink(createPostLink);
    };
    
    window.showEditPostView = (post) => {
        postsContainer.classList.add('d-none');
        postDetailContainer.classList.add('d-none');
        postFormContainer.classList.remove('d-none');
        
        // Set form title and values
        document.getElementById('post-form-title').textContent = 'Edit Post';
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-author').value = post.author || '';
        document.getElementById('post-content').value = post.content;
        
        // Update active nav link
        setActiveNavLink(homeLink);
    };
    
    // Helper to set active nav link
    const setActiveNavLink = (activeLink) => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    };
    
    // Error handling - make it global
    window.showError = (message) => {
        document.getElementById('error-message').textContent = message;
        errorToast.show();
    };
    
    // Initialize the application
    init();
});
