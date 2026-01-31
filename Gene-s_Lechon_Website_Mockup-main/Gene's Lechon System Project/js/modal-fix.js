// modal-fix.js - Fix modal positioning and form layout

document.addEventListener('DOMContentLoaded', function() {
    // Fix modal positioning
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.zIndex = '2000';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.padding = '20px';
        modal.style.backdropFilter = 'blur(5px)';
    });
    
    // Handle modal open/close
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.modal-close, .cancel');
    
    openModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Center all form content
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.margin = '0 auto';
        form.style.maxWidth = '100%';
    });
    
    // Fix form rows layout
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach(row => {
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr 1fr';
        row.style.gap = '20px';
        row.style.marginBottom = '25px';
        row.style.width = '100%';
    });
    
    // Ensure form groups take full width
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.style.width = '100%';
        group.style.position = 'relative';
    });
    
    // Handle responsive layout
    function handleResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        
        formRows.forEach(row => {
            if (isMobile) {
                row.style.gridTemplateColumns = '1fr';
                row.style.gap = '15px';
            } else {
                row.style.gridTemplateColumns = '1fr 1fr';
                row.style.gap = '20px';
            }
        });
        
        modals.forEach(modal => {
            if (isMobile) {
                modal.style.padding = '10px';
            } else {
                modal.style.padding = '20px';
            }
        });
    }
    
    // Initial call
    handleResponsiveLayout();
    
    // Listen for window resize
    window.addEventListener('resize', handleResponsiveLayout);
    
    // Form validation
    const saveButtons = document.querySelectorAll('#saveItemBtn, #updateItemBtn, #saveProductBtn, #updateProductBtn, #saveCategoryBtn');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const form = this.closest('.modal').querySelector('form');
            if (form) {
                const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = 'var(--danger-color)';
                        input.style.backgroundColor = 'rgba(244, 67, 54, 0.05)';
                        
                        // Add error message
                        let errorMsg = input.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.style.color = 'var(--danger-color)';
                            errorMsg.style.fontSize = '0.85rem';
                            errorMsg.style.marginTop = '5px';
                            errorMsg.textContent = 'This field is required';
                            input.parentNode.appendChild(errorMsg);
                        }
                    } else {
                        input.style.borderColor = '';
                        input.style.backgroundColor = '';
                        
                        // Remove error message
                        const errorMsg = input.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Show error notification
                    showNotification('Please fill in all required fields', 'error');
                    return false;
                }
                
                // Form is valid - show success
                showNotification('Item saved successfully!', 'success');
                
                // Close modal after 1.5 seconds
                setTimeout(() => {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Reset form
                    form.reset();
                }, 1500);
            }
        });
    });
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});