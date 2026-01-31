// inventory.js - Inventory Management Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize inventory
    initInventory();
    
    // Set current date
    setCurrentDate();
    
    // Load inventory data
    loadInventoryData();
    
    // Setup event listeners
    setupInventoryListeners();
});

// Initialize inventory
function initInventory() {
    // Check if inventory data exists in localStorage
    if (!localStorage.getItem('inventoryData')) {
        // Load sample data if none exists
        loadSampleInventoryData();
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

// Load sample inventory data
function loadSampleInventoryData() {
    const sampleData = [
        {
            id: 1,
            name: 'Whole Lechon (18-20kg)',
            category: 'lechon',
            currentStock: 5,
            minStock: 10,
            unit: 'pcs',
            unitPrice: 6000,
            supplier: 'Local Farm',
            notes: 'Premium quality',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Lechon Belly (3kg)',
            category: 'belly',
            currentStock: 8,
            minStock: 15,
            unit: 'pcs',
            unitPrice: 1800,
            supplier: 'Local Farm',
            notes: 'Fresh daily',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Lechon Sauce',
            category: 'sauce',
            currentStock: 20,
            minStock: 10,
            unit: 'bottle',
            unitPrice: 120,
            supplier: 'Sauce Co.',
            notes: '500ml bottles',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Soft Drinks (1.5L)',
            category: 'drinks',
            currentStock: 25,
            minStock: 20,
            unit: 'bottle',
            unitPrice: 80,
            supplier: 'Beverage Co.',
            notes: 'Various flavors',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 5,
            name: 'Charcoal',
            category: 'supplies',
            currentStock: 3,
            minStock: 10,
            unit: 'pack',
            unitPrice: 350,
            supplier: 'Supply Store',
            notes: 'For roasting',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 6,
            name: 'Cooking Oil',
            category: 'supplies',
            currentStock: 2,
            minStock: 5,
            unit: 'liter',
            unitPrice: 180,
            supplier: 'Oil Co.',
            notes: 'Vegetable oil',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 7,
            name: 'Spices Pack',
            category: 'supplies',
            currentStock: 15,
            minStock: 10,
            unit: 'pack',
            unitPrice: 250,
            supplier: 'Spice Market',
            notes: 'Secret recipe mix',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 8,
            name: 'Banana Leaves',
            category: 'supplies',
            currentStock: 50,
            minStock: 30,
            unit: 'pcs',
            unitPrice: 5,
            supplier: 'Local Market',
            notes: 'For wrapping',
            lastUpdated: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('inventoryData', JSON.stringify(sampleData));
}

// Load inventory data
function loadInventoryData() {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    displayInventoryTable(inventoryData);
    updateLowStockAlerts(inventoryData);
    updateInventoryStats(inventoryData);
}

// Display inventory table
function displayInventoryTable(data) {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const totalValue = item.currentStock * item.unitPrice;
        const status = getStockStatus(item.currentStock, item.minStock);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${getCategoryName(item.category)}</td>
            <td>${item.currentStock}</td>
            <td>${item.minStock}</td>
            <td>${item.unit}</td>
            <td>₱${item.unitPrice.toLocaleString()}</td>
            <td>₱${totalValue.toLocaleString()}</td>
            <td><span class="stock-status ${status.class}">${status.text}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-action btn-restock" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'lechon': 'Whole Lechon',
        'belly': 'Lechon Belly',
        'sauce': 'Sauces',
        'drinks': 'Drinks',
        'supplies': 'Supplies',
        'other': 'Other'
    };
    
    return categories[category] || category;
}

// Get stock status
function getStockStatus(current, min) {
    if (current === 0) {
        return { class: 'status-out', text: 'Out of Stock' };
    } else if (current <= min) {
        return { class: 'status-low', text: 'Low Stock' };
    } else {
        return { class: 'status-normal', text: 'In Stock' };
    }
}

// Update low stock alerts
function updateLowStockAlerts(data) {
    const lowStockItems = data.filter(item => item.currentStock <= item.minStock);
    const alertContainer = document.getElementById('lowStockItems');
    
    if (!alertContainer) return;
    
    if (lowStockItems.length === 0) {
        alertContainer.innerHTML = `
            <div class="alert-item">
                <div class="alert-item-info">
                    <h4>No Low Stock Items</h4>
                    <p>All inventory items are at healthy levels</p>
                </div>
            </div>
        `;
        return;
    }
    
    alertContainer.innerHTML = '';
    
    lowStockItems.forEach(item => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <div class="alert-item-info">
                <h4>${item.name}</h4>
                <p>${getCategoryName(item.category)} • Min: ${item.minStock}</p>
            </div>
            <div class="alert-item-stock">
                ${item.currentStock} ${item.unit} remaining
            </div>
        `;
        
        alertContainer.appendChild(alertItem);
    });
}

// Update inventory stats
function updateInventoryStats(data) {
    const lowStockCount = data.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length;
    const totalProducts = data.length;
    const inventoryValue = data.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
    const uniqueCategories = new Set(data.map(item => item.category)).size;
    
    // Update DOM elements
    document.querySelector('.inventory-stats .stat-card:nth-child(1) .value').textContent = lowStockCount;
    document.querySelector('.inventory-stats .stat-card:nth-child(2) .value').textContent = totalProducts;
    document.querySelector('.inventory-stats .stat-card:nth-child(3) .value').textContent = `₱${inventoryValue.toLocaleString()}`;
    document.querySelector('.inventory-stats .stat-card:nth-child(4) .value').textContent = uniqueCategories;
}

// Setup event listeners
function setupInventoryListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInventory');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
            const filteredData = data.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.supplier?.toLowerCase().includes(searchTerm)
            );
            displayInventoryTable(filteredData);
        });
    }
    
    // Filter functionality
    document.getElementById('categoryFilter')?.addEventListener('change', filterTable);
    document.getElementById('stockFilter')?.addEventListener('change', filterTable);
    
    // Add item button
    document.getElementById('addItemBtn')?.addEventListener('click', function() {
        openAddItemModal();
    });
    
    // Refresh button
    document.getElementById('refreshInventory')?.addEventListener('click', function() {
        loadInventoryData();
        showNotification('Inventory data refreshed!', 'success');
    });
    
    // Export button
    document.getElementById('exportInventory')?.addEventListener('click', exportInventoryData);
    
    // Table action buttons (using event delegation)
    document.addEventListener('click', function(e) {
        // Edit button
        if (e.target.closest('.btn-edit')) {
            const btn = e.target.closest('.btn-edit');
            const itemId = parseInt(btn.dataset.id);
            openEditItemModal(itemId);
        }
        
        // Delete button
        if (e.target.closest('.btn-delete')) {
            const btn = e.target.closest('.btn-delete');
            const itemId = parseInt(btn.dataset.id);
            deleteItem(itemId);
        }
        
        // Restock button
        if (e.target.closest('.btn-restock')) {
            const btn = e.target.closest('.btn-restock');
            const itemId = parseInt(btn.dataset.id);
            restockItem(itemId);
        }
    });
    
    // Modal setup
    setupModalListeners();
}

// Filter table
function filterTable() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    
    let filteredData = data;
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredData = filteredData.filter(item => item.category === categoryFilter);
    }
    
    // Apply stock filter
    if (stockFilter === 'low') {
        filteredData = filteredData.filter(item => item.currentStock <= item.minStock && item.currentStock > 0);
    } else if (stockFilter === 'out') {
        filteredData = filteredData.filter(item => item.currentStock === 0);
    } else if (stockFilter === 'normal') {
        filteredData = filteredData.filter(item => item.currentStock > item.minStock);
    }
    
    displayInventoryTable(filteredData);
}

// Open add item modal
function openAddItemModal() {
    const modal = document.getElementById('addItemModal');
    const form = document.getElementById('addItemForm');
    
    form.reset();
    modal.classList.add('active');
    
    // Set focus on first input
    setTimeout(() => {
        document.getElementById('itemName').focus();
    }, 100);
}

// Open edit item modal
function openEditItemModal(itemId) {
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    const item = data.find(i => i.id === itemId);
    
    if (!item) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    const modal = document.getElementById('editItemModal');
    const form = modal.querySelector('form');
    
    // Populate form
    form.querySelector('#itemName').value = item.name;
    form.querySelector('#itemCategory').value = item.category;
    form.querySelector('#itemStock').value = item.currentStock;
    form.querySelector('#itemMinStock').value = item.minStock;
    form.querySelector('#itemUnit').value = item.unit;
    form.querySelector('#itemPrice').value = item.unitPrice;
    form.querySelector('#itemSupplier').value = item.supplier || '';
    form.querySelector('#itemNotes').value = item.notes || '';
    
    // Store item ID in form
    form.dataset.itemId = itemId;
    
    modal.classList.add('active');
}

// Delete item
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    const filteredData = data.filter(item => item.id !== itemId);
    
    localStorage.setItem('inventoryData', JSON.stringify(filteredData));
    loadInventoryData();
    
    showNotification('Item deleted successfully!', 'success');
}

// Restock item
function restockItem(itemId) {
    const quantity = prompt('Enter restock quantity:');
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
        showNotification('Invalid quantity entered!', 'error');
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    const itemIndex = data.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    data[itemIndex].currentStock += parseInt(quantity);
    data[itemIndex].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('inventoryData', JSON.stringify(data));
    loadInventoryData();
    
    showNotification(`Restocked ${quantity} units of ${data[itemIndex].name}`, 'success');
}

// Setup modal listeners
function setupModalListeners() {
    // Add item modal
    const addModal = document.getElementById('addItemModal');
    const addForm = document.getElementById('addItemForm');
    
    addModal.querySelector('.cancel').addEventListener('click', () => {
        addModal.classList.remove('active');
    });
    
    addModal.querySelector('.modal-close').addEventListener('click', () => {
        addModal.classList.remove('active');
    });
    
    document.getElementById('saveItemBtn')?.addEventListener('click', saveNewItem);
    
    // Edit item modal
    const editModal = document.getElementById('editItemModal');
    
    editModal.querySelector('.cancel').addEventListener('click', () => {
        editModal.classList.remove('active');
    });
    
    editModal.querySelector('.modal-close').addEventListener('click', () => {
        editModal.classList.remove('active');
    });
    
    document.getElementById('updateItemBtn')?.addEventListener('click', updateItem);
    
    // Close modals when clicking outside
    [addModal, editModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Save new item
function saveNewItem() {
    const form = document.getElementById('addItemForm');
    
    // Validate form
    if (!form.checkValidity()) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    
    // Generate new ID
    const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    
    // Create new item
    const newItem = {
        id: newId,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        currentStock: parseInt(document.getElementById('itemStock').value),
        minStock: parseInt(document.getElementById('itemMinStock').value),
        unit: document.getElementById('itemUnit').value,
        unitPrice: parseFloat(document.getElementById('itemPrice').value),
        supplier: document.getElementById('itemSupplier').value || '',
        notes: document.getElementById('itemNotes').value || '',
        lastUpdated: new Date().toISOString()
    };
    
    data.push(newItem);
    localStorage.setItem('inventoryData', JSON.stringify(data));
    
    // Close modal and refresh
    document.getElementById('addItemModal').classList.remove('active');
    loadInventoryData();
    
    showNotification('New item added successfully!', 'success');
}

// Update item
function updateItem() {
    const modal = document.getElementById('editItemModal');
    const form = modal.querySelector('form');
    const itemId = parseInt(form.dataset.itemId);
    
    // Validate form
    if (!form.checkValidity()) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    const itemIndex = data.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    // Update item
    data[itemIndex] = {
        ...data[itemIndex],
        name: form.querySelector('#itemName').value,
        category: form.querySelector('#itemCategory').value,
        currentStock: parseInt(form.querySelector('#itemStock').value),
        minStock: parseInt(form.querySelector('#itemMinStock').value),
        unit: form.querySelector('#itemUnit').value,
        unitPrice: parseFloat(form.querySelector('#itemPrice').value),
        supplier: form.querySelector('#itemSupplier').value || '',
        notes: form.querySelector('#itemNotes').value || '',
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('inventoryData', JSON.stringify(data));
    
    // Close modal and refresh
    modal.classList.remove('active');
    loadInventoryData();
    
    showNotification('Item updated successfully!', 'success');
}

// Export inventory data
function exportInventoryData() {
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    
    // Convert to CSV
    const headers = ['Product Name', 'Category', 'Current Stock', 'Min Stock', 'Unit', 'Unit Price', 'Total Value', 'Status', 'Supplier'];
    const csvData = data.map(item => {
        const totalValue = item.currentStock * item.unitPrice;
        const status = getStockStatus(item.currentStock, item.minStock);
        
        return [
            `"${item.name}"`,
            `"${getCategoryName(item.category)}"`,
            item.currentStock,
            item.minStock,
            item.unit,
            item.unitPrice,
            totalValue,
            `"${status.text}"`,
            `"${item.supplier || ''}"`
        ].join(',');
    });
    
    const csv = [headers.join(','), ...csvData].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Inventory data exported successfully!', 'success');
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