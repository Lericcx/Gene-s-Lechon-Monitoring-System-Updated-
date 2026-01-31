// transactions.js - Transaction History Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize transactions
    initTransactions();
    
    // Set current date
    setCurrentDate();
    
    // Load transactions data
    loadTransactions();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupTransactionListeners();
});

// Initialize transactions
function initTransactions() {
    // Check if transactions data exists in localStorage
    if (!localStorage.getItem('transactions')) {
        // Load sample transactions if none exists
        loadSampleTransactions();
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
    
    // Set default date range (current month)
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
}

// Format date for input field
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Load sample transactions
function loadSampleTransactions() {
    const sampleTransactions = [
        {
            id: 'TXN-20241001-001',
            orderNumber: 'ORD-00124',
            date: '2024-10-15T14:30:00',
            items: [
                { name: 'Whole Lechon (20kg)', price: 6000, quantity: 1, total: 6000 },
                { name: 'Lechon Sauce (500ml)', price: 120, quantity: 2, total: 240 },
                { name: 'Soft Drinks (1.5L)', price: 80, quantity: 3, total: 240 }
            ],
            subtotal: 6480,
            discount: 0,
            total: 6480,
            paymentMethod: 'cash',
            cashReceived: 7000,
            change: 520,
            status: 'completed',
            customer: 'Juan Dela Cruz',
            notes: 'For birthday party'
        },
        {
            id: 'TXN-20241002-002',
            orderNumber: 'ORD-00125',
            date: '2024-10-16T11:45:00',
            items: [
                { name: 'Lechon Belly (5kg)', price: 2700, quantity: 1, total: 2700 },
                { name: 'Sisig (1kg)', price: 350, quantity: 2, total: 700 },
                { name: 'Extra Rice (per plate)', price: 25, quantity: 10, total: 250 }
            ],
            subtotal: 3650,
            discount: 100,
            total: 3550,
            paymentMethod: 'card',
            cashReceived: 3550,
            change: 0,
            status: 'completed',
            customer: 'Maria Santos',
            notes: 'Office celebration'
        },
        {
            id: 'TXN-20241003-003',
            orderNumber: 'ORD-00126',
            date: '2024-10-17T16:20:00',
            items: [
                { name: 'Whole Lechon (25kg)', price: 8000, quantity: 1, total: 8000 }
            ],
            subtotal: 8000,
            discount: 0,
            total: 8000,
            paymentMethod: 'online',
            cashReceived: 8000,
            change: 0,
            status: 'completed',
            customer: 'Robert Lim',
            notes: 'Wedding reception'
        },
        {
            id: 'TXN-20241004-004',
            orderNumber: 'ORD-00127',
            date: '2024-10-18T09:15:00',
            items: [
                { name: 'Lechon Belly (3kg)', price: 1800, quantity: 2, total: 3600 },
                { name: 'Lechon Sauce (500ml)', price: 120, quantity: 4, total: 480 }
            ],
            subtotal: 4080,
            discount: 80,
            total: 4000,
            paymentMethod: 'cash',
            cashReceived: 5000,
            change: 1000,
            status: 'completed',
            customer: 'Ana Reyes',
            notes: 'Family gathering'
        },
        {
            id: 'TXN-20241005-005',
            orderNumber: 'ORD-00128',
            date: '2024-10-19T13:45:00',
            items: [
                { name: 'Whole Lechon (22kg)', price: 7000, quantity: 1, total: 7000 },
                { name: 'Soft Drinks (1.5L)', price: 80, quantity: 5, total: 400 }
            ],
            subtotal: 7400,
            discount: 0,
            total: 7400,
            paymentMethod: 'card',
            cashReceived: 7400,
            change: 0,
            status: 'pending',
            customer: 'Carlos Gomez',
            notes: 'Will pick up at 6 PM'
        },
        {
            id: 'TXN-20241006-006',
            orderNumber: 'ORD-00129',
            date: '2024-10-20T10:30:00',
            items: [
                { name: 'Lechon Belly (6kg)', price: 3200, quantity: 1, total: 3200 },
                { name: 'Sisig (1kg)', price: 350, quantity: 3, total: 1050 },
                { name: 'Extra Rice (per plate)', price: 25, quantity: 15, total: 375 }
            ],
            subtotal: 4625,
            discount: 125,
            total: 4500,
            paymentMethod: 'online',
            cashReceived: 4500,
            change: 0,
            status: 'completed',
            customer: 'Lisa Tan',
            notes: 'Corporate event'
        },
        {
            id: 'TXN-20241007-007',
            orderNumber: 'ORD-00130',
            date: '2024-10-21T15:00:00',
            items: [
                { name: 'Whole Lechon (30kg)', price: 9000, quantity: 1, total: 9000 }
            ],
            subtotal: 9000,
            discount: 500,
            total: 8500,
            paymentMethod: 'cash',
            cashReceived: 10000,
            change: 1500,
            status: 'completed',
            customer: 'Michael Chen',
            notes: 'Large family reunion'
        },
        {
            id: 'TXN-20241008-008',
            orderNumber: 'ORD-00131',
            date: '2024-10-22T12:15:00',
            items: [
                { name: 'Lechon Belly (3kg)', price: 1800, quantity: 1, total: 1800 }
            ],
            subtotal: 1800,
            discount: 0,
            total: 1800,
            paymentMethod: 'cash',
            cashReceived: 2000,
            change: 200,
            status: 'cancelled',
            customer: 'Pedro Santos',
            notes: 'Cancelled - customer request'
        }
    ];
    
    localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
}

// Load transactions
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Apply filters
    const filteredTransactions = applyFilters(transactions);
    
    // Display transactions
    displayTransactions(filteredTransactions);
    
    // Update summary
    updateTransactionSummary(filteredTransactions);
    
    // Update charts
    updateCharts(filteredTransactions);
}

// Apply filters to transactions
function applyFilters(transactions) {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const minAmount = parseFloat(document.getElementById('minAmount').value) || 0;
    const maxAmount = parseFloat(document.getElementById('maxAmount').value) || Infinity;
    
    let filtered = transactions;
    
    // Filter by date range
    if (startDate && endDate) {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59');
        
        filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= start && transactionDate <= end;
        });
    }
    
    // Filter by payment method
    if (paymentMethod !== 'all') {
        filtered = filtered.filter(transaction => transaction.paymentMethod === paymentMethod);
    }
    
    // Filter by amount range
    filtered = filtered.filter(transaction => {
        return transaction.total >= minAmount && transaction.total <= maxAmount;
    });
    
    return filtered;
}

// Display transactions in table
function displayTransactions(transactions) {
    const tableBody = document.getElementById('transactionsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const rowsPerPage = parseInt(document.getElementById('rowsPerPage').value) || 10;
    const currentPage = parseInt(document.getElementById('currentPage').textContent) || 1;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
    
    // Update pagination info
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
    
    // Calculate slice for current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, transactions.length);
    const pageTransactions = transactions.slice(startIndex, endIndex);
    
    pageTransactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tableBody.appendChild(row);
    });
    
    // Show empty message if no transactions
    if (pageTransactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray-color);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <h3>No transactions found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Create transaction table row
function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    
    // Format date
    const transactionDate = new Date(transaction.date);
    const formattedDate = transactionDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = transactionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Get status class
    const statusClass = `status-${transaction.status}`;
    const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
    
    // Get payment method icon and text
    let paymentIcon = 'fas fa-money-bill-wave';
    let paymentText = 'Cash';
    let paymentClass = 'method-cash';
    
    if (transaction.paymentMethod === 'card') {
        paymentIcon = 'fas fa-credit-card';
        paymentText = 'Card';
        paymentClass = 'method-card';
    } else if (transaction.paymentMethod === 'online') {
        paymentIcon = 'fas fa-mobile-alt';
        paymentText = 'Online';
        paymentClass = 'method-online';
    }
    
    // Count items
    const itemCount = transaction.items.length;
    const itemsText = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    
    row.innerHTML = `
        <td>
            <strong>${transaction.id}</strong><br>
            <small>${transaction.orderNumber}</small>
        </td>
        <td>
            <div>${formattedDate}</div>
            <small>${formattedTime}</small>
        </td>
        <td>${itemsText}</td>
        <td><strong>₱${transaction.total.toLocaleString()}</strong></td>
        <td>
            <div class="payment-method ${paymentClass}">
                <i class="${paymentIcon}"></i>
                <span>${paymentText}</span>
            </div>
        </td>
        <td>
            <span class="transaction-status ${statusClass}">${statusText}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-view-details" data-id="${transaction.id}">
                    <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn-print" data-id="${transaction.id}">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Update transaction summary
function updateTransactionSummary(transactions) {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.total, 0);
    const averageTransaction = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    
    // Count payment methods
    const paymentMethods = {
        cash: transactions.filter(t => t.paymentMethod === 'cash').length,
        card: transactions.filter(t => t.paymentMethod === 'card').length,
        online: transactions.filter(t => t.paymentMethod === 'online').length
    };
    
    // Update DOM
    document.getElementById('totalTransactions').textContent = totalTransactions.toLocaleString();
    document.getElementById('totalAmount').textContent = `₱${totalAmount.toLocaleString()}`;
    document.getElementById('averageTransaction').textContent = `₱${averageTransaction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Calculate payment method percentages
    const totalWithMethods = paymentMethods.cash + paymentMethods.card + paymentMethods.online;
    let paymentMethodText = 'No transactions';
    
    if (totalWithMethods > 0) {
        const cashPercent = Math.round((paymentMethods.cash / totalWithMethods) * 100);
        const cardPercent = Math.round((paymentMethods.card / totalWithMethods) * 100);
        const onlinePercent = Math.round((paymentMethods.online / totalWithMethods) * 100);
        
        paymentMethodText = `Cash: ${cashPercent}%, Card: ${cardPercent}%, Online: ${onlinePercent}%`;
        document.getElementById('paymentMethods').textContent = Object.keys(paymentMethods).filter(key => paymentMethods[key] > 0).length;
    } else {
        document.getElementById('paymentMethods').textContent = '0';
    }
    
    // Update payment method distribution text
    const summaryChange = document.querySelector('.summary-card:nth-child(4) .summary-change');
    if (summaryChange) {
        summaryChange.textContent = paymentMethodText;
    }
}

// Initialize charts
function initCharts() {
    // Daily Transactions Chart
    const dailyCtx = document.getElementById('dailyTransactionsChart');
    if (dailyCtx) {
        window.dailyTransactionsChart = new Chart(dailyCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Transactions (₱)',
                    data: [],
                    backgroundColor: 'rgba(198, 40, 40, 0.7)',
                    borderColor: 'rgba(198, 40, 40, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Payment Method Chart
    const paymentCtx = document.getElementById('paymentMethodChart');
    if (paymentCtx) {
        window.paymentMethodChart = new Chart(paymentCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Cash', 'Card', 'Online'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(33, 150, 243, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update charts with transaction data
function updateCharts(transactions) {
    // Group transactions by date
    const transactionsByDate = {};
    transactions.forEach(transaction => {
        const date = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!transactionsByDate[date]) {
            transactionsByDate[date] = 0;
        }
        transactionsByDate[date] += transaction.total;
    });
    
    // Update daily transactions chart
    if (window.dailyTransactionsChart) {
        const dates = Object.keys(transactionsByDate).sort((a, b) => {
            return new Date(a) - new Date(b);
        });
        const amounts = dates.map(date => transactionsByDate[date]);
        
        window.dailyTransactionsChart.data.labels = dates;
        window.dailyTransactionsChart.data.datasets[0].data = amounts;
        window.dailyTransactionsChart.update();
    }
    
    // Update payment method chart
    if (window.paymentMethodChart) {
        const paymentMethods = {
            cash: transactions.filter(t => t.paymentMethod === 'cash').length,
            card: transactions.filter(t => t.paymentMethod === 'card').length,
            online: transactions.filter(t => t.paymentMethod === 'online').length
        };
        
        window.paymentMethodChart.data.datasets[0].data = [
            paymentMethods.cash,
            paymentMethods.card,
            paymentMethods.online
        ];
        window.paymentMethodChart.update();
    }
}

// Setup event listeners
function setupTransactionListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Apply filters button
    document.getElementById('applyFilters')?.addEventListener('click', function() {
        loadTransactions();
        showNotification('Filters applied successfully!', 'success');
    });
    
    // Reset filters button
    document.getElementById('resetFilters')?.addEventListener('click', function() {
        resetFilters();
        loadTransactions();
        showNotification('Filters reset successfully!', 'info');
    });
    
    // Export transactions button
    document.getElementById('exportTransactions')?.addEventListener('click', exportTransactions);
    
    // Search transactions
    const searchInput = document.getElementById('searchTransactions');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            
            const filteredTransactions = transactions.filter(transaction =>
                transaction.id.toLowerCase().includes(searchTerm) ||
                transaction.orderNumber.toLowerCase().includes(searchTerm) ||
                transaction.customer?.toLowerCase().includes(searchTerm) ||
                transaction.notes?.toLowerCase().includes(searchTerm)
            );
            
            displayTransactions(filteredTransactions);
            updateTransactionSummary(filteredTransactions);
        });
    }
    
    // Refresh button
    document.getElementById('refreshTransactions')?.addEventListener('click', function() {
        loadTransactions();
        showNotification('Transactions refreshed!', 'success');
    });
    
    // Rows per page change
    document.getElementById('rowsPerPage')?.addEventListener('change', function() {
        document.getElementById('currentPage').textContent = '1';
        loadTransactions();
    });
    
    // Pagination buttons
    document.getElementById('prevPage')?.addEventListener('click', function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        if (currentPage > 1) {
            document.getElementById('currentPage').textContent = (currentPage - 1).toString();
            loadTransactions();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        const totalPages = parseInt(document.getElementById('totalPages').textContent);
        if (currentPage < totalPages) {
            document.getElementById('currentPage').textContent = (currentPage + 1).toString();
            loadTransactions();
        }
    });
    
    // View details and print buttons (event delegation)
    document.addEventListener('click', function(e) {
        // View details button
        if (e.target.closest('.btn-view-details')) {
            const btn = e.target.closest('.btn-view-details');
            const transactionId = btn.dataset.id;
            viewTransactionDetails(transactionId);
        }
        
        // Print button
        if (e.target.closest('.btn-print')) {
            const btn = e.target.closest('.btn-print');
            const transactionId = btn.dataset.id;
            printTransaction(transactionId);
        }
    });
    
    // Modal setup
    setupModalListeners();
}

// Reset filters
function resetFilters() {
    // Set default date range (current month)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
    document.getElementById('paymentMethod').value = 'all';
    document.getElementById('minAmount').value = '';
    document.getElementById('maxAmount').value = '';
}

// Export transactions
function exportTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const filteredTransactions = applyFilters(transactions);
    
    // Convert to CSV
    const headers = ['ID', 'Order Number', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment Method', 'Status'];
    const csvData = filteredTransactions.map(transaction => {
        const itemsText = transaction.items.map(item => `${item.name} (${item.quantity}x)`).join('; ');
        
        return [
            `"${transaction.id}"`,
            `"${transaction.orderNumber}"`,
            `"${new Date(transaction.date).toLocaleString()}"`,
            `"${transaction.customer || 'N/A'}"`,
            `"${itemsText}"`,
            transaction.subtotal,
            transaction.discount,
            transaction.total,
            `"${transaction.paymentMethod}"`,
            `"${transaction.status}"`
        ].join(',');
    });
    
    const csv = [headers.join(','), ...csvData].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Transactions exported successfully!', 'success');
}

// View transaction details
function viewTransactionDetails(transactionId) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
        showNotification('Transaction not found!', 'error');
        return;
    }
    
    // Format date
    const transactionDate = new Date(transaction.date);
    const formattedDate = transactionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = transactionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Get status text
    const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
    
    // Get payment method text
    let paymentMethodText = 'Cash';
    if (transaction.paymentMethod === 'card') {
        paymentMethodText = 'Credit/Debit Card';
    } else if (transaction.paymentMethod === 'online') {
        paymentMethodText = 'Online Payment';
    }
    
    // Create details HTML
    const detailsHTML = `
        <div class="details-header">
            <div>
                <h2>Transaction Details</h2>
                <div class="transaction-id">${transaction.id}</div>
                <div class="transaction-date">${formattedDate} at ${formattedTime}</div>
            </div>
            <div style="text-align: right;">
                <div class="transaction-status ${'status-' + transaction.status}" style="font-size: 0.9rem; display: inline-block;">
                    ${statusText}
                </div>
                <div style="margin-top: 10px; color: var(--gray-color);">
                    ${transaction.orderNumber}
                </div>
            </div>
        </div>
        
        <div class="details-summary">
            <div class="details-row">
                <div class="details-label">Customer</div>
                <div class="details-value">${transaction.customer || 'Walk-in Customer'}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Payment Method</div>
                <div class="details-value">${paymentMethodText}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Subtotal</div>
                <div class="details-value">₱${transaction.subtotal.toLocaleString()}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Discount</div>
                <div class="details-value">₱${transaction.discount.toLocaleString()}</div>
            </div>
            <div class="details-row total">
                <div class="details-label">Total Amount</div>
                <div class="details-value">₱${transaction.total.toLocaleString()}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Cash Received</div>
                <div class="details-value">₱${transaction.cashReceived?.toLocaleString() || '0'}</div>
            </div>
            <div class="details-row">
                <div class="details-label">Change</div>
                <div class="details-value">₱${transaction.change?.toLocaleString() || '0'}</div>
            </div>
        </div>
        
        <div class="details-items">
            <h3>Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${transaction.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₱${item.price.toLocaleString()}</td>
                            <td class="item-total">₱${item.total.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="details-footer">
            <div class="notes">
                <strong>Notes:</strong> ${transaction.notes || 'No notes'}
            </div>
            <div style="color: var(--gray-color); font-size: 0.9rem;">
                Processed by: ${localStorage.getItem('username') || 'Admin'}
            </div>
        </div>
    `;
    
    // Display in modal
    document.getElementById('transactionDetails').innerHTML = detailsHTML;
    document.getElementById('transactionDetailsModal').classList.add('active');
    
    // Store transaction ID for printing
    document.getElementById('printReceiptBtn').dataset.transactionId = transactionId;
}

// Print transaction receipt
function printTransaction(transactionId) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
        showNotification('Transaction not found!', 'error');
        return;
    }
    
    // Create receipt window
    const printWindow = window.open('', '_blank');
    
    const receiptHTML = `
        <html>
        <head>
            <title>Receipt - ${transaction.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .header h1 { color: #c62828; margin: 0; font-size: 1.5rem; }
                .info { margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .total { text-align: right; font-weight: bold; margin-top: 20px; padding-top: 15px; border-top: 2px solid #333; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                @media print {
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Gene's Lechon</h1>
                <p>Transaction Receipt</p>
                <p><strong>${transaction.id}</strong></p>
                <p>${new Date(transaction.date).toLocaleString()}</p>
            </div>
            
            <div class="info">
                <p><strong>Order:</strong> ${transaction.orderNumber}</p>
                <p><strong>Customer:</strong> ${transaction.customer || 'Walk-in'}</p>
                <p><strong>Payment:</strong> ${transaction.paymentMethod.toUpperCase()}</p>
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
                    ${transaction.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₱${item.total.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total">
                <p>Subtotal: ₱${transaction.subtotal.toLocaleString()}</p>
                <p>Discount: ₱${transaction.discount.toLocaleString()}</p>
                <p><strong>Total: ₱${transaction.total.toLocaleString()}</strong></p>
                <p>Cash: ₱${transaction.cashReceived?.toLocaleString() || '0'}</p>
                <p>Change: ₱${transaction.change?.toLocaleString() || '0'}</p>
            </div>
            
            <div class="footer">
                <p>Thank you for your business!</p>
                <p>Visit us again at Gene's Lechon</p>
                <p>Printed: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    
    showNotification('Receipt printed successfully!', 'success');
}

// Setup modal listeners
function setupModalListeners() {
    const detailsModal = document.getElementById('transactionDetailsModal');
    
    // Close modal buttons
    detailsModal.querySelector('.cancel').addEventListener('click', () => {
        detailsModal.classList.remove('active');
    });
    
    detailsModal.querySelector('.modal-close').addEventListener('click', () => {
        detailsModal.classList.remove('active');
    });
    
    // Print receipt button in modal
    document.getElementById('printReceiptBtn').addEventListener('click', function() {
        const transactionId = this.dataset.transactionId;
        if (transactionId) {
            printTransaction(transactionId);
            detailsModal.classList.remove('active');
        }
    });
    
    // Close modal when clicking outside
    detailsModal.addEventListener('click', function(e) {
        if (e.target === detailsModal) {
            detailsModal.classList.remove('active');
        }
    });
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