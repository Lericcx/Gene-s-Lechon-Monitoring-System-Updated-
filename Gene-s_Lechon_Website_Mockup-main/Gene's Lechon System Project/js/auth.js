// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and trying to access protected pages
    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'index.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // If logged in and trying to access login page
    if (isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked;
            
            // Simple authentication (in real app, this would be server-side)
            if (username === 'admin' && password === 'password123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password. Try: admin / password123');
            }
        });
    }
    
    // Show/hide password
    const showPasswordBtn = document.getElementById('showPassword');
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            }
        });
    }
    
    // Set username in dashboard if logged in
    const username = localStorage.getItem('username');
    const userProfileSpan = document.querySelector('.user-profile span');
    if (userProfileSpan && username) {
        userProfileSpan.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    // Check authentication on page load
    checkAuth();
});