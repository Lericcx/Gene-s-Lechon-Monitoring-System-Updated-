// pos.js - POS System Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize POS System
    initPOS();
    
    // Set current date
    setCurrentDate();
    
    // Load products
    loadProducts();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize POS System
function initPOS() {
    // Load saved order from localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        const order = JSON.parse(savedOrder);
        updateOrderDisplay(order);
    } else {
        generateOrderNumber();
    }
    
    // Set initial order summary
    updateOrderSummary();
}

// Set current date
function setCurrentDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-GB', options);
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = dateString;
    }
}

// Generate unique order number
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const orderNumber = `${year}${month}${day}${randomNum}`;
    document.getElementById('orderNumber').textContent = orderNumber;
    localStorage.setItem('currentOrderNumber', orderNumber);
    
    return orderNumber;
}

// Load products from data
function loadProducts() {
    const products = [
        {
            id: 1,
            name: 'Whole Lechon (18-20kg)',
            price: 6000,
            category: 'lechon',
            image: 'fas fa-piggy-bank',
            stock: 5
        },
        {
            id: 2,
            name: 'Whole Lechon (21-23kg)',
            price: 7000,
            category: 'lechon',
            image: 'fas fa-piggy-bank',
            stock: 3
        },
        {
            id: 3,
            name: 'Whole Lechon (24-26kg)',
            price: 8000,
            category: 'lechon',
            image: 'fas fa-piggy-bank',
            stock: 2
        },
        {
            id: 4,
            name: 'Lechon Belly (3kg)',
            price: 1800,
            category: 'belly',
            image: 'fas fa-bacon',
            stock: 8
        },
        {
            id: 5,
            name: 'Lechon Belly (5kg)',
            price: 2700,
            category: 'belly',
            image: 'fas fa-bacon',
            stock: 6
        },
        {
            id: 6,
            name: 'Lechon Belly (6kg)',
            price: 3200,
            category: 'belly',
            image: 'fas fa-bacon',
            stock: 4
        },
        {
            id: 7,
            name: 'Sisig (1kg)',
            price: 350,
            category: 'other',
            image: 'fas fa-utensils',
            stock: 15
        },
        {
            id: 8,
            name: 'Lechon Sauce (500ml)',
            price: 120,
            category: 'other',
            image: 'fas fa-wine-bottle',
            stock: 20
        },
        {
            id: 9,
            name: 'Drinks (1.5L)',
            price: 80,
            category: 'other',
            image: 'fas fa-wine-glass-alt',
            stock: 25
        }
    ];
    
    displayProducts(products);
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">₱${product.price.toLocaleString()}</div>
        <div class="product-stock">Stock: ${product.stock}</div>
        <button class="btn-add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add to Order
        </button>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-to-cart')) {
            const btn = e.target.closest('.btn-add-to-cart');
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        }
    });
    
    // Quantity controls
    document.addEventListener('click', function(e) {
        const orderItems = document.getElementById('orderItems');
        
        if (e.target.closest('.btn-qty.minus')) {
            const item = e.target.closest('.order-item');
            decreaseQuantity(item);
        }
        
        if (e.target.closest('.btn-qty.plus')) {
            const item = e.target.closest('.order-item');
            increaseQuantity(item);
        }
        
        if (e.target.closest('.btn-remove')) {
            const item = e.target.closest('.order-item');
            removeItem(item);
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('qty-input')) {
            const item = e.target.closest('.order-item');
            updateItemQuantity(item, parseInt(e.target.value));
        }
    });
    
    // Payment method buttons
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Action buttons
    document.getElementById('applyDiscount')?.addEventListener('click', applyDiscount);
    document.getElementById('clearOrder')?.addEventListener('click', clearOrder);
    document.getElementById('processOrder')?.addEventListener('click', processOrder);
    
    // Modal events
    setupModalEvents();
}

// Filter products by category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const products = [
        { id: 1, name: 'Whole Lechon (18-20kg)', price: 6000 },
        { id: 2, name: 'Whole Lechon (21-23kg)', price: 7000 },
        { id: 3, name: 'Whole Lechon (24-26kg)', price: 8000 },
        { id: 4, name: 'Lechon Belly (3kg)', price: 1800 },
        { id: 5, name: 'Lechon Belly (5kg)', price: 2700 },
        { id: 6, name: 'Lechon Belly (6kg)', price: 3200 },
        { id: 7, name: 'Sisig (1kg)', price: 350 },
        { id: 8, name: 'Lechon Sauce (500ml)', price: 120 },
        { id: 9, name: 'Drinks (1.5L)', price: 80 }
    ];
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const orderItems = document.getElementById('orderItems');
    const existingItem = Array.from(orderItems.querySelectorAll('.order-item')).find(item => {
        const name = item.querySelector('.item-name').textContent;
        return name === product.name;
    });
    
    if (existingItem) {
        increaseQuantity(existingItem);
    } else {
        addNewItem(product);
    }
    
    // Save order to localStorage
    saveOrderToStorage();
}

// Add new item to order
function addNewItem(product) {
    const orderItems = document.getElementById('orderItems');
    
    const item = document.createElement('div');
    item.className = 'order-item';
    item.dataset.id = product.id;
    item.dataset.price = product.price;
    
    item.innerHTML = `
        <div class="item-info">
            <div class="item-name">${product.name}</div>
            <div class="item-price">₱${product.price.toLocaleString()}</div>
        </div>
        <div class="item-controls">
            <button class="btn-qty minus"><i class="fas fa-minus"></i></button>
            <input type="number" value="1" min="1" class="qty-input">
            <button class="btn-qty plus"><i class="fas fa-plus"></i></button>
            <button class="btn-remove"><i class="fas fa-trash"></i></button>
        </div>
        <div class="item-total">₱${product.price.toLocaleString()}</div>
    `;
    
    orderItems.appendChild(item);
    updateOrderSummary();
}

// Increase item quantity
function increaseQuantity(item) {
    const qtyInput = item.querySelector('.qty-input');
    const currentQty = parseInt(qtyInput.value);
    qtyInput.value = currentQty + 1;
    updateItemQuantity(item, currentQty + 1);
}

// Decrease item quantity
function decreaseQuantity(item) {
    const qtyInput = item.querySelector('.qty-input');
    const currentQty = parseInt(qtyInput.value);
    
    if (currentQty > 1) {
        qtyInput.value = currentQty - 1;
        updateItemQuantity(item, currentQty - 1);
    }
}

// Update item quantity
function updateItemQuantity(item, newQuantity) {
    const price = parseFloat(item.dataset.price);
    const total = price * newQuantity;
    
    item.querySelector('.item-total').textContent = `₱${total.toLocaleString()}`;
    updateOrderSummary();
}

// Remove item from order
function removeItem(item) {
    item.remove();
    updateOrderSummary();
    saveOrderToStorage();
}

// Update order summary
function updateOrderSummary() {
    const orderItems = document.querySelectorAll('.order-item');
    let subtotal = 0;
    
    orderItems.forEach(item => {
        const totalText = item.querySelector('.item-total').textContent;
        const total = parseFloat(totalText.replace('₱', '').replace(/,/g, ''));
        subtotal += total;
    });
    
    const discount = parseFloat(localStorage.getItem('orderDiscount') || 0);
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = `₱${subtotal.toLocaleString()}`;
    document.getElementById('discount').textContent = `₱${discount.toLocaleString()}`;
    document.getElementById('total').textContent = `₱${total.toLocaleString()}`;
    
    // Update amount due in modal
    document.getElementById('amountDue').textContent = `₱${total.toLocaleString()}`;
}

// Apply discount
function applyDiscount() {
    const discount = prompt('Enter discount amount (in pesos):', '0');
    if (discount !== null) {
        const discountAmount = parseFloat(discount) || 0;
        localStorage.setItem('orderDiscount', discountAmount);
        updateOrderSummary();
        
        // Show notification
        showNotification(`Discount of ₱${discountAmount.toLocaleString()} applied!`, 'success');
    }
}

// Clear order
function clearOrder() {
    if (confirm('Are you sure you want to clear the current order?')) {
        document.getElementById('orderItems').innerHTML = '';
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('orderDiscount');
        updateOrderSummary();
        generateOrderNumber();
        
        showNotification('Order cleared successfully!', 'info');
    }
}

// Process order
function processOrder() {
    const orderItems = document.querySelectorAll('.order-item');
    if (orderItems.length === 0) {
        showNotification('Please add items to the order first!', 'warning');
        return;
    }
    
    // Open payment modal
    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');
    
    // Reset cash input
    document.getElementById('cashAmount').value = '';
    document.getElementById('changeAmount').textContent = '₱0.00';
}

// Setup modal events
function setupModalEvents() {
    const modal = document.getElementById('paymentModal');
    const cashInput = document.getElementById('cashAmount');
    const cancelBtn = modal.querySelector('.cancel');
    const confirmBtn = modal.querySelector('.confirm');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Calculate change on cash input
    cashInput.addEventListener('input', function() {
        const amountDue = parseFloat(document.getElementById('amountDue').textContent.replace('₱', '').replace(/,/g, ''));
        const cashReceived = parseFloat(this.value) || 0;
        const change = cashReceived - amountDue;
        
        if (change >= 0) {
            document.getElementById('changeAmount').textContent = `₱${change.toLocaleString()}`;
            document.getElementById('changeAmount').style.color = '#27ae60';
        } else {
            document.getElementById('changeAmount').textContent = `-₱${Math.abs(change).toLocaleString()}`;
            document.getElementById('changeAmount').style.color = '#e74c3c';
        }
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
    }
    
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Confirm payment
    confirmBtn.addEventListener('click', function() {
        const amountDue = parseFloat(document.getElementById('amountDue').textContent.replace('₱', '').replace(/,/g, ''));
        const cashReceived = parseFloat(cashInput.value) || 0;
        
        if (cashReceived < amountDue) {
            showNotification('Insufficient cash received!', 'error');
            return;
        }
        
        // Process payment
        completeOrder(cashReceived);
        closeModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Complete order
function completeOrder(cashReceived) {
    const orderNumber = document.getElementById('orderNumber').textContent;
    const orderItems = document.querySelectorAll('.order-item');
    const items = [];
    
    orderItems.forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const price = parseFloat(item.dataset.price);
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const total = price * quantity;
        
        items.push({
            name,
            price,
            quantity,
            total
        });
    });
    
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('₱', '').replace(/,/g, ''));
    const discount = parseFloat(document.getElementById('discount').textContent.replace('₱', '').replace(/,/g, ''));
    const total = parseFloat(document.getElementById('total').textContent.replace('₱', '').replace(/,/g, ''));
    const change = cashReceived - total;
    
    // Create receipt
    const receipt = {
        orderNumber,
        items,
        subtotal,
        discount,
        total,
        cashReceived,
        change,
        timestamp: new Date().toISOString(),
        paymentMethod: document.querySelector('.payment-btn.active').dataset.method
    };
    
    // Save transaction
    saveTransaction(receipt);
    
    // Clear order
    clearOrder();
    
    // Print receipt (simulated)
    printReceipt(receipt);
    
    showNotification(`Order ${orderNumber} completed successfully!`, 'success');
}

// Save transaction to localStorage
function saveTransaction(receipt) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(receipt);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Print receipt
function printReceipt(receipt) {
    const printWindow = window.open('', '_blank');
    
    const receiptHTML = `
        <html>
        <head>
            <title>Receipt - Order ${receipt.orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .header h1 { color: #c62828; margin: 0; }
                .info { margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .total { text-align: right; font-weight: bold; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Gene's Lechon</h1>
                <p>Order #${receipt.orderNumber}</p>
                <p>${new Date(receipt.timestamp).toLocaleString()}</p>
            </div>
            
            <div class="info">
                <p><strong>Payment Method:</strong> ${receipt.paymentMethod.toUpperCase()}</p>
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${receipt.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₱${item.total.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total">
                <p>Subtotal: ₱${receipt.subtotal.toLocaleString()}</p>
                <p>Discount: ₱${receipt.discount.toLocaleString()}</p>
                <p>Total: ₱${receipt.total.toLocaleString()}</p>
                <p>Cash Received: ₱${receipt.cashReceived.toLocaleString()}</p>
                <p>Change: ₱${receipt.change.toLocaleString()}</p>
            </div>
            
            <div class="footer">
                <p>Thank you for your order!</p>
                <p>Visit us again!</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}

// Save order to localStorage
function saveOrderToStorage() {
    const orderItems = document.querySelectorAll('.order-item');
    const items = [];
    
    orderItems.forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const price = parseFloat(item.dataset.price);
        const quantity = parseInt(item.querySelector('.qty-input').value);
        
        items.push({
            name,
            price,
            quantity
        });
    });
    
    const order = {
        orderNumber: document.getElementById('orderNumber').textContent,
        items,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(order));
}

// Update order display from storage
function updateOrderDisplay(order) {
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = '';
    
    order.items.forEach(item => {
        addNewItem(item);
    });
    
    document.getElementById('orderNumber').textContent = order.orderNumber;
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