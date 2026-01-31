// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                // Add overlay
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    display: block;
                `;
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    overlay.remove();
                });
                
                document.body.appendChild(overlay);
            } else {
                // Remove overlay
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            }
        });
    }
    
    // Update current date
    function updateCurrentDate() {
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            currentDate.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    // Set active navigation item based on current page
    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.nav-item a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    updateCurrentDate();
    setActiveNav();
});