// products.js - Product Management Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products
    initProducts();
    
    // Set current date
    setCurrentDate();
    
    // Load products data
    loadProductsData();
    
    // Load categories
    loadCategories();
    
    // Setup event listeners
    setupProductListeners();
});

// Initialize products
function initProducts() {
    // Check if products data exists in localStorage
    if (!localStorage.getItem('productsData')) {
        // Load sample data if none exists
        loadSampleProductsData();
    }
    
    // Check if categories data exists
    if (!localStorage.getItem('productCategories')) {
        // Load sample categories
        loadSampleCategories();
    }
}

// Set current date
function setCurrentDate() {
    const now = new Date();
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        weekday: 'long'
    };
    const dateString = now.toLocaleDateString('en-US', options);
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = dateString;
    }
}

// Load sample products data
function loadSampleProductsData() {
    const sampleData = [
        {
            id: 1,
            name: 'Whole Lechon (18-20kg)',
            category: 'lechon',
            price: 6000,
            cost: 4500,
            sku: 'LCH-001',
            unit: 'pcs',
            description: 'Premium whole roasted pig, 18-20kg, serves 30-40 people',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Whole Lechon (21-23kg)',
            category: 'lechon',
            price: 7000,
            cost: 5200,
            sku: 'LCH-002',
            unit: 'pcs',
            description: 'Premium whole roasted pig, 21-23kg, serves 35-45 people',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Lechon Belly (3kg)',
            category: 'belly',
            price: 1800,
            cost: 1200,
            sku: 'LBL-001',
            unit: 'pcs',
            description: 'Roasted pork belly, 3kg, serves 8-10 people',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Lechon Belly (5kg)',
            category: 'belly',
            price: 2700,
            cost: 1800,
            sku: 'LBL-002',
            unit: 'pcs',
            description: 'Roasted pork belly, 5kg, serves 12-15 people',
            active: true,
            createdAt: new Date().toISOString()
        },
        // products.js - Product Management Functionality (Continued)

        {
            id: 5,
            name: 'Sisig (1kg)',
            category: 'other',
            price: 350,
            cost: 200,
            sku: 'SIS-001',
            unit: 'kg',
            description: 'Classic Filipino sisig made with pork, served sizzling hot',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 6,
            name: 'Lechon Sauce (500ml)',
            category: 'sauce',
            price: 120,
            cost: 60,
            sku: 'SAU-001',
            unit: 'bottle',
            description: 'Special lechon sauce, 500ml bottle',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 7,
            name: 'Soft Drinks (1.5L)',
            category: 'drinks',
            price: 80,
            cost: 50,
            sku: 'DRK-001',
            unit: 'bottle',
            description: 'Assorted soft drinks, 1.5 liter',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 8,
            name: 'Extra Rice (per plate)',
            category: 'other',
            price: 25,
            cost: 10,
            sku: 'RCE-001',
            unit: 'plate',
            description: 'Steamed white rice, per plate',
            active: true,
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('productsData', JSON.stringify(sampleData));
}

// Load sample categories
function loadSampleCategories() {
    const sampleCategories = [
        {
            id: 1,
            name: 'Whole Lechon',
            color: '#c62828',
            icon: 'fas fa-piggy-bank',
            description: 'Whole roasted pig products',
            productCount: 2
        },
        {
            id: 2,
            name: 'Lechon Belly',
            color: '#ff9800',
            icon: 'fas fa-bacon',
            description: 'Roasted pork belly products',
            productCount: 2
        },
        {
            id: 3,
            name: 'Sauces',
            color: '#ff5252',
            icon: 'fas fa-wine-bottle',
            description: 'Dips and sauces',
            productCount: 1
        },
        {
            id: 4,
            name: 'Drinks',
            color: '#2196f3',
            icon: 'fas fa-wine-glass-alt',
            description: 'Beverages and drinks',
            productCount: 1
        },
        {
            id: 5,
            name: 'Other Products',
            color: '#4caf50',
            icon: 'fas fa-utensils',
            description: 'Other food items',
            productCount: 2
        }
    ];
    
    localStorage.setItem('productCategories', JSON.stringify(sampleCategories));
}

// Load products data
function loadProductsData(categoryFilter = 'all') {
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    
    // Filter by category if specified
    let filteredProducts = productsData;
    if (categoryFilter !== 'all') {
        filteredProducts = productsData.filter(product => product.category === categoryFilter);
    }
    
    displayProductsGrid(filteredProducts, categories);
    displayProductsList(filteredProducts, categories);
}

// Load categories
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    displayCategories(categories);
    populateCategorySelect(categories);
}

// Display categories
function displayCategories(categories) {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        categoriesGrid.appendChild(categoryCard);
    });
}

// Create category card
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.categoryId = category.id;
    
    card.innerHTML = `
        <div class="category-icon" style="background-color: ${category.color + '20'}; color: ${category.color};">
            <i class="${category.icon}"></i>
        </div>
        <div class="category-info">
            <h4>${category.name}</h4>
            <p>${category.productCount || 0} products</p>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', function() {
        // Remove active class from all categories
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to clicked category
        this.classList.add('active');
        
        // Load products for this category
        const categoryId = this.dataset.categoryId;
        const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
        const category = categories.find(c => c.id === parseInt(categoryId));
        
        if (category) {
            loadProductsData(category.name.toLowerCase().replace(' ', '-'));
        }
    });
    
    return card;
}

// Populate category select in forms
function populateCategorySelect(categories) {
    const categorySelects = document.querySelectorAll('#productCategory, #editProductCategory');
    
    categorySelects.forEach(select => {
        select.innerHTML = '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name.toLowerCase().replace(' ', '-');
            option.textContent = category.name;
            select.appendChild(option);
        });
    });
}

// Display products in grid view
function displayProductsGrid(products, categories) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product, categories);
        productsGrid.appendChild(productCard);
    });
}

// Create product card for grid view
function createProductCard(product, categories) {
    const category = categories.find(c => c.name.toLowerCase().replace(' ', '-') === product.category);
    const margin = product.price - product.cost;
    const marginPercentage = product.cost > 0 ? ((margin / product.cost) * 100).toFixed(1) : 0;
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    card.innerHTML = `
        <div class="product-card-header">
            <div class="product-category" style="background-color: ${category?.color + '20' || '#f5f5f5'}; color: ${category?.color || '#333'};">
                <i class="${category?.icon || 'fas fa-box'}"></i>
                <span>${getCategoryName(product.category)}</span>
            </div>
            <div class="product-icon" style="background-color: ${category?.color + '20' || '#f5f5f5'}; color: ${category?.color || '#333'};">
                <i class="${category?.icon || 'fas fa-box'}"></i>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description || 'No description available'}</div>
        </div>
        <div class="product-card-body">
            <div class="product-price">₱${product.price.toLocaleString()}</div>
            <div class="product-cost">Cost: ₱${product.cost.toLocaleString()}</div>
            <div class="product-margin">Margin: ${marginPercentage}%</div>
            <div class="product-sku">SKU: ${product.sku || 'N/A'}</div>
        </div>
        <div class="product-card-footer">
            <div class="product-status ${product.active ? 'status-active' : 'status-inactive'}">
                <i class="fas fa-circle"></i>
                <span>${product.active ? 'Active' : 'Inactive'}</span>
            </div>
            <div class="product-actions">
                <button class="btn-product-action btn-edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-product-action btn-toggle-product" data-id="${product.id}" data-active="${product.active}">
                    <i class="fas fa-power-off"></i>
                </button>
                <button class="btn-product-action btn-delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Display products in list view
function displayProductsList(products, categories) {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const listItem = createProductListItem(product, categories);
        productsList.appendChild(listItem);
    });
}

// Create product list item
function createProductListItem(product, categories) {
    const category = categories.find(c => c.name.toLowerCase().replace(' ', '-') === product.category);
    const margin = product.price - product.cost;
    
    const listItem = document.createElement('div');
    listItem.className = 'product-list-item';
    listItem.dataset.productId = product.id;
    
    listItem.innerHTML = `
        <div class="product-list-info">
            <div class="product-list-icon" style="background-color: ${category?.color + '20' || '#f5f5f5'}; color: ${category?.color || '#333'};">
                <i class="${category?.icon || 'fas fa-box'}"></i>
            </div>
            <div class="product-list-name">
                <h4>${product.name}</h4>
                <p>${product.description || 'No description'}</p>
            </div>
        </div>
        <div class="product-list-category">${getCategoryName(product.category)}</div>
        <div class="product-list-price">₱${product.price.toLocaleString()}</div>
        <div class="product-list-cost">₱${product.cost.toLocaleString()}</div>
        <div class="product-list-status ${product.active ? 'status-active' : 'status-inactive'}">
            ${product.active ? 'Active' : 'Inactive'}
        </div>
        <div class="product-list-actions">
            <button class="btn-product-action btn-edit-product" data-id="${product.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-product-action btn-toggle-product" data-id="${product.id}" data-active="${product.active}">
                <i class="fas fa-power-off"></i>
            </button>
            <button class="btn-product-action btn-delete-product" data-id="${product.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return listItem;
}

// Get category name from slug
function getCategoryName(categorySlug) {
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    const category = categories.find(c => c.name.toLowerCase().replace(' ', '-') === categorySlug);
    return category?.name || categorySlug;
}

// Setup event listeners
function setupProductListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
            const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
            
            const filteredProducts = productsData.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm) ||
                product.sku?.toLowerCase().includes(searchTerm)
            );
            
            displayProductsGrid(filteredProducts, categories);
            displayProductsList(filteredProducts, categories);
        });
    }
    
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            
            // Update active button
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide views
            if (viewType === 'grid') {
                document.getElementById('productsGrid').style.display = 'grid';
                document.getElementById('productsList').style.display = 'none';
            } else {
                document.getElementById('productsGrid').style.display = 'none';
                document.getElementById('productsList').style.display = 'block';
            }
        });
    });
    
    // Add product button
    document.getElementById('addProductBtn')?.addEventListener('click', function() {
        openAddProductModal();
    });
    
    // Add category button
    document.getElementById('addCategoryBtn')?.addEventListener('click', function() {
        openAddCategoryModal();
    });
    
    // Refresh button
    document.getElementById('refreshProducts')?.addEventListener('click', function() {
        loadProductsData();
        loadCategories();
        showNotification('Products data refreshed!', 'success');
    });
    
    // Product action buttons (using event delegation)
    document.addEventListener('click', function(e) {
        // Edit product button
        if (e.target.closest('.btn-edit-product')) {
            const btn = e.target.closest('.btn-edit-product');
            const productId = parseInt(btn.dataset.id);
            openEditProductModal(productId);
        }
        
        // Toggle product status button
        if (e.target.closest('.btn-toggle-product')) {
            const btn = e.target.closest('.btn-toggle-product');
            const productId = parseInt(btn.dataset.id);
            const isActive = btn.dataset.active === 'true';
            toggleProductStatus(productId, isActive);
        }
        
        // Delete product button
        if (e.target.closest('.btn-delete-product')) {
            const btn = e.target.closest('.btn-delete-product');
            const productId = parseInt(btn.dataset.id);
            deleteProduct(productId);
        }
    });
    
    // Modal setup
    setupModalListeners();
}

// Open add product modal
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const form = document.getElementById('addProductForm');
    
    form.reset();
    
    // Set default SKU
    const skuInput = document.getElementById('productSKU');
    if (skuInput && !skuInput.value) {
        const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
        const nextId = productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1;
        skuInput.value = `PROD-${nextId.toString().padStart(3, '0')}`;
    }
    
    modal.classList.add('active');
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('productName').focus();
    }, 100);
}

// Open add category modal
function openAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    const form = document.getElementById('addCategoryForm');
    
    form.reset();
    modal.classList.add('active');
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('categoryName').focus();
    }, 100);
}

// Open edit product modal
function openEditProductModal(productId) {
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const modal = document.getElementById('editProductModal');
    const form = modal.querySelector('form');
    
    if (!form) {
        // Clone the add product form structure
        const addForm = document.getElementById('addProductForm').cloneNode(true);
        addForm.id = 'editProductForm';
        modal.querySelector('.modal-body').innerHTML = '';
        modal.querySelector('.modal-body').appendChild(addForm);
        
        // Re-populate category select
        const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
        populateCategorySelect(categories);
    }
    
    // Populate form with product data
    form.querySelector('#productName').value = product.name;
    form.querySelector('#productCategory').value = product.category;
    form.querySelector('#productPrice').value = product.price;
    form.querySelector('#productCost').value = product.cost;
    form.querySelector('#productSKU').value = product.sku || '';
    form.querySelector('#productUnit').value = product.unit || 'pcs';
    form.querySelector('#productDescription').value = product.description || '';
    form.querySelector('#productActive').checked = product.active;
    
    // Store product ID in form
    form.dataset.productId = productId;
    
    modal.classList.add('active');
}

// Toggle product status
function toggleProductStatus(productId, isActive) {
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    const productIndex = productsData.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    productsData[productIndex].active = !isActive;
    localStorage.setItem('productsData', JSON.stringify(productsData));
    
    loadProductsData();
    
    const newStatus = !isActive ? 'activated' : 'deactivated';
    showNotification(`Product ${newStatus} successfully!`, 'success');
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    const filteredData = productsData.filter(p => p.id !== productId);
    
    localStorage.setItem('productsData', JSON.stringify(filteredData));
    loadProductsData();
    
    showNotification('Product deleted successfully!', 'success');
}

// Setup modal listeners
function setupModalListeners() {
    // Add product modal
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    
    addProductModal.querySelector('.cancel').addEventListener('click', () => {
        addProductModal.classList.remove('active');
    });
    
    addProductModal.querySelector('.modal-close').addEventListener('click', () => {
        addProductModal.classList.remove('active');
    });
    
    document.getElementById('saveProductBtn')?.addEventListener('click', saveNewProduct);
    
    // Add category modal
    const addCategoryModal = document.getElementById('addCategoryModal');
    const addCategoryForm = document.getElementById('addCategoryForm');
    
    addCategoryModal.querySelector('.cancel').addEventListener('click', () => {
        addCategoryModal.classList.remove('active');
    });
    
    addCategoryModal.querySelector('.modal-close').addEventListener('click', () => {
        addCategoryModal.classList.remove('active');
    });
    
    document.getElementById('saveCategoryBtn')?.addEventListener('click', saveNewCategory);
    
    // Edit product modal
    const editProductModal = document.getElementById('editProductModal');
    
    editProductModal.querySelector('.cancel').addEventListener('click', () => {
        editProductModal.classList.remove('active');
    });
    
    editProductModal.querySelector('.modal-close').addEventListener('click', () => {
        editProductModal.classList.remove('active');
    });
    
    document.getElementById('updateProductBtn')?.addEventListener('click', updateProduct);
    
    // Close modals when clicking outside
    [addProductModal, addCategoryModal, editProductModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Save new product
function saveNewProduct() {
    const form = document.getElementById('addProductForm');
    
    // Validate form
    if (!form.checkValidity()) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    
    // Generate new ID
    const newId = productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1;
    
    // Create new product
    const newProduct = {
        id: newId,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        cost: parseFloat(document.getElementById('productCost').value),
        sku: document.getElementById('productSKU').value || '',
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value || '',
        active: document.getElementById('productActive').checked,
        createdAt: new Date().toISOString()
    };
    
    productsData.push(newProduct);
    localStorage.setItem('productsData', JSON.stringify(productsData));
    
    // Close modal and refresh
    document.getElementById('addProductModal').classList.remove('active');
    loadProductsData();
    
    showNotification('New product added successfully!', 'success');
}

// Save new category
function saveNewCategory() {
    const form = document.getElementById('addCategoryForm');
    
    // Validate form
    if (!form.checkValidity()) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    
    // Check if category already exists
    const categoryName = document.getElementById('categoryName').value;
    const existingCategory = categories.find(c => 
        c.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (existingCategory) {
        showNotification('Category with this name already exists!', 'error');
        return;
    }
    
    // Generate new ID
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    
    // Create new category
    const newCategory = {
        id: newId,
        name: categoryName,
        color: document.getElementById('categoryColor').value,
        icon: document.getElementById('categoryIcon').value,
        description: document.getElementById('categoryDescription').value || '',
        productCount: 0
    };
    
    categories.push(newCategory);
    localStorage.setItem('productCategories', JSON.stringify(categories));
    
    // Close modal and refresh
    document.getElementById('addCategoryModal').classList.remove('active');
    loadCategories();
    
    showNotification('New category added successfully!', 'success');
}

// Update product
function updateProduct() {
    const modal = document.getElementById('editProductModal');
    const form = modal.querySelector('form');
    const productId = parseInt(form.dataset.productId);
    
    // Validate form
    if (!form.checkValidity()) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
    const productIndex = productsData.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Update product
    productsData[productIndex] = {
        ...productsData[productIndex],
        name: form.querySelector('#productName').value,
        category: form.querySelector('#productCategory').value,
        price: parseFloat(form.querySelector('#productPrice').value),
        cost: parseFloat(form.querySelector('#productCost').value),
        sku: form.querySelector('#productSKU').value || '',
        unit: form.querySelector('#productUnit').value,
        description: form.querySelector('#productDescription').value || '',
        active: form.querySelector('#productActive').checked
    };
    
    localStorage.setItem('productsData', JSON.stringify(productsData));
    
    // Close modal and refresh
    modal.classList.remove('active');
    loadProductsData();
    
    showNotification('Product updated successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}