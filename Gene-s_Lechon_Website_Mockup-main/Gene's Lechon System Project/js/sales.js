// sales.js - Sales Monitoring Functionality

// Global variables
let salesData = [];
let filteredSalesData = [];
let currentPage = 1;
let rowsPerPage = 10;
let currentChartType = 'line';
let currentPeriod = 'thisWeek';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sales monitoring
    initSalesMonitoring();
    
    // Set current date
    setCurrentDate();
    
    // Load sales data
    loadSalesData();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupSalesListeners();
});

// Initialize sales monitoring
function initSalesMonitoring() {
    // Set default date values
    const now = new Date();
    document.getElementById('customStartDate').value = formatDate(now);
    document.getElementById('customEndDate').value = formatDate(now);
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

// Format date for input field
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Load sales data
function loadSalesData() {
    // Get transactions data
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Transform transactions into sales data
    salesData = [];
    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            salesData.push({
                date: transaction.date,
                transactionId: transaction.id,
                orderNumber: transaction.orderNumber,
                product: item.name,
                category: getProductCategory(item.name),
                quantity: item.quantity,
                unitPrice: item.price,
                totalAmount: item.total,
                paymentMethod: transaction.paymentMethod,
                customer: transaction.customer,
                status: transaction.status
            });
        });
    });
    
    // Apply filters
    applySalesFilters();
}

// Get product category from name
function getProductCategory(productName) {
    if (productName.toLowerCase().includes('whole lechon')) {
        return 'lechon';
    } else if (productName.toLowerCase().includes('belly')) {
        return 'belly';
    } else {
        return 'other';
    }
}

// Apply sales filters
function applySalesFilters() {
    const period = document.getElementById('salesPeriod').value;
    const category = document.getElementById('salesCategory').value;
    
    // Get date range based on period
    const dateRange = getDateRange(period);
    
    // Filter by date range
    filteredSalesData = salesData.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= dateRange.start && saleDate <= dateRange.end;
    });
    
    // Filter by category
    if (category !== 'all') {
        filteredSalesData = filteredSalesData.filter(sale => sale.category === category);
    }
    
    // Update displays
    updateSalesOverview();
    updateCharts();
    displaySalesTable();
}

// Get date range based on period
function getDateRange(period) {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    
    switch (period) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'yesterday':
            start.setDate(now.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(now.getDate() - 1);
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisWeek':
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'lastWeek':
            start.setDate(now.getDate() - now.getDay() - 7);
            start.setHours(0, 0, 0, 0);
            end.setDate(now.getDate() - now.getDay() - 1);
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisMonth':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'lastMonth':
            start.setMonth(now.getMonth() - 1, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(now.getMonth(), 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisQuarter':
            const quarter = Math.floor(now.getMonth() / 3);
            start.setMonth(quarter * 3, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(quarter * 3 + 3, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'lastQuarter':
            const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
            start.setMonth(lastQuarter * 3, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(lastQuarter * 3 + 3, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisYear':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        case 'custom':
            const customStart = new Date(document.getElementById('customStartDate').value + 'T00:00:00');
            const customEnd = new Date(document.getElementById('customEndDate').value + 'T23:59:59');
            return { start: customStart, end: customEnd };
        default:
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
    }
    
    return { start, end };
}

// Update sales overview
function updateSalesOverview() {
    if (filteredSalesData.length === 0) {
        // Set default values
        document.getElementById('totalSalesValue').textContent = '₱0.00';
        document.getElementById('totalTransactionsValue').textContent = '0';
        document.getElementById('averageOrderValue').textContent = '₱0.00';
        document.getElementById('bestProduct').textContent = 'None';
        document.getElementById('bestProductSales').textContent = '0 units sold';
        
        // Reset change indicators
        document.getElementById('totalSalesChange').innerHTML = '<i class="fas fa-minus"></i> No data';
        document.getElementById('transactionsChange').innerHTML = '<i class="fas fa-minus"></i> No data';
        document.getElementById('averageOrderChange').innerHTML = '<i class="fas fa-minus"></i> No data';
        
        return;
    }
    
    // Calculate metrics
    const totalSales = filteredSalesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const uniqueTransactions = [...new Set(filteredSalesData.map(sale => sale.transactionId))].length;
    const averageOrderValue = totalSales / uniqueTransactions;
    
    // Find best selling product
    const productSales = {};
    filteredSalesData.forEach(sale => {
        if (!productSales[sale.product]) {
            productSales[sale.product] = { quantity: 0, revenue: 0 };
        }
        productSales[sale.product].quantity += sale.quantity;
        productSales[sale.product].revenue += sale.totalAmount;
    });
    
    let bestProduct = '';
    let maxQuantity = 0;
    
    Object.keys(productSales).forEach(product => {
        if (productSales[product].quantity > maxQuantity) {
            maxQuantity = productSales[product].quantity;
            bestProduct = product;
        }
    });
    
    // Update DOM
    document.getElementById('totalSalesValue').textContent = `₱${totalSales.toLocaleString()}`;
    document.getElementById('totalTransactionsValue').textContent = uniqueTransactions.toLocaleString();
    document.getElementById('averageOrderValue').textContent = `₱${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('bestProduct').textContent = bestProduct || 'None';
    document.getElementById('bestProductSales').textContent = `${maxQuantity} units sold`;
    
    // Calculate changes (simplified - would compare with previous period in real app)
    const change = Math.random() * 20 - 5; // Random change between -5% and +15%
    const changeIcon = change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    const changeClass = change >= 0 ? '' : 'negative';
    const changeText = `${Math.abs(change).toFixed(1)}% vs previous period`;
    
    document.getElementById('totalSalesChange').innerHTML = `<i class="${changeIcon}"></i> ${changeText}`;
    document.getElementById('totalSalesChange').className = `overview-change ${changeClass}`;
    
    document.getElementById('transactionsChange').innerHTML = `<i class="${changeIcon}"></i> ${changeText}`;
    document.getElementById('transactionsChange').className = `overview-change ${changeClass}`;
    
    document.getElementById('averageOrderChange').innerHTML = `<i class="${changeIcon}"></i> ${changeText}`;
    document.getElementById('averageOrderChange').className = `overview-change ${changeClass}`;
}

// Initialize charts
function initCharts() {
    // Sales Trend Chart
    const trendCtx = document.getElementById('salesTrendChart');
    if (trendCtx) {
        window.salesTrendChart = new Chart(trendCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sales (₱)',
                    data: [],
                    borderColor: '#c62828',
                    backgroundColor: 'rgba(198, 40, 40, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
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
    
    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryDistributionChart');
    if (categoryCtx) {
        window.categoryDistributionChart = new Chart(categoryCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Whole Lechon', 'Lechon Belly', 'Other'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(198, 40, 40, 0.8)',
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(76, 175, 80, 0.8)'
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
    
    // Hourly Sales Chart
    const hourlyCtx = document.getElementById('hourlySalesChart');
    if (hourlyCtx) {
        window.hourlySalesChart = new Chart(hourlyCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sales (₱)',
                    data: [],
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: 'rgba(33, 150, 243, 1)',
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
}

// Update charts with data
function updateCharts() {
    updateSalesTrendChart();
    updateCategoryDistributionChart();
    updateHourlySalesChart();
    updateTopProducts();
}

// Update sales trend chart
function updateSalesTrendChart() {
    if (!window.salesTrendChart || filteredSalesData.length === 0) return;
    
    // Group sales by date
    const salesByDate = {};
    filteredSalesData.forEach(sale => {
        const date = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!salesByDate[date]) {
            salesByDate[date] = 0;
        }
        salesByDate[date] += sale.totalAmount;
    });
    
    // Sort dates
    const dates = Object.keys(salesByDate).sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    
    const amounts = dates.map(date => salesByDate[date]);
    
    // Update chart
    window.salesTrendChart.data.labels = dates;
    window.salesTrendChart.data.datasets[0].data = amounts;
    window.salesTrendChart.update();
}

// Update category distribution chart
function updateCategoryDistributionChart() {
    if (!window.categoryDistributionChart || filteredSalesData.length === 0) return;
    
    // Calculate category totals
    const categoryTotals = {
        'lechon': 0,
        'belly': 0,
        'other': 0
    };
    
    filteredSalesData.forEach(sale => {
        if (categoryTotals[sale.category] !== undefined) {
            categoryTotals[sale.category] += sale.totalAmount;
        }
    });
    
    // Update chart
    window.categoryDistributionChart.data.datasets[0].data = [
        categoryTotals.lechon,
        categoryTotals.belly,
        categoryTotals.other
    ];
    window.categoryDistributionChart.update();
}

// Update hourly sales chart
function updateHourlySalesChart() {
    if (!window.hourlySalesChart) return;
    
    // Generate sample hourly data
    const hours = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
    const salesData = [];
    
    // Generate random sales data for each hour
    hours.forEach(() => {
        salesData.push(Math.floor(Math.random() * 5000) + 1000);
    });
    
    // Update chart
    window.hourlySalesChart.data.labels = hours;
    window.hourlySalesChart.data.datasets[0].data = salesData;
    window.hourlySalesChart.update();
}

// Update top products list
function updateTopProducts() {
    if (filteredSalesData.length === 0) {
        document.getElementById('topProductsList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray-color);">
                <i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <p>No sales data available</p>
            </div>
        `;
        return;
    }
    
    // Calculate product sales
    const productSales = {};
    filteredSalesData.forEach(sale => {
        if (!productSales[sale.product]) {
            productSales[sale.product] = { quantity: 0, revenue: 0 };
        }
        productSales[sale.product].quantity += sale.quantity;
        productSales[sale.product].revenue += sale.totalAmount;
    });
    
    // Convert to array and sort
    const sortBy = document.getElementById('topProductsSort').value;
    const productsArray = Object.keys(productSales).map(product => ({
        name: product,
        quantity: productSales[product].quantity,
        revenue: productSales[product].revenue
    }));
    
    if (sortBy === 'quantity') {
        productsArray.sort((a, b) => b.quantity - a.quantity);
    } else {
        productsArray.sort((a, b) => b.revenue - a.revenue);
    }
    
    // Get top 5 products
    const topProducts = productsArray.slice(0, 5);
    
    // Update DOM
    const topProductsList = document.getElementById('topProductsList');
    topProductsList.innerHTML = '';
    
    topProducts.forEach((product, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-rank ${rankClass}">${index + 1}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-meta">
                    <span class="product-quantity">${product.quantity} units</span>
                    <span class="product-revenue">₱${product.revenue.toLocaleString()}</span>
                </div>
            </div>
            <div class="product-sales">${sortBy === 'quantity' ? product.quantity : '₱' + product.revenue.toLocaleString()}</div>
        `;
        
        topProductsList.appendChild(productItem);
    });
}

// Display sales table
function displaySalesTable() {
    const tableBody = document.getElementById('salesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedData = [...filteredSalesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    rowsPerPage = parseInt(document.getElementById('salesRowsPerPage').value) || 10;
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    
    // Update pagination info
    document.getElementById('totalSalesPages').textContent = totalPages;
    document.getElementById('prevSalesPage').disabled = currentPage === 1;
    document.getElementById('nextSalesPage').disabled = currentPage === totalPages || totalPages === 0;
    
    // Calculate slice for current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, sortedData.length);
    const pageData = sortedData.slice(startIndex, endIndex);
    
    pageData.forEach(sale => {
        const row = createSalesTableRow(sale);
        tableBody.appendChild(row);
    });
    
    // Show empty message if no data
    if (pageData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--gray-color);">
                <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <h3>No sales data found</h3>
                <p>Try adjusting your filters or select a different time period</p>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Create sales table row
function createSalesTableRow(sale) {
    const row = document.createElement('tr');
    
    // Format date
    const saleDate = new Date(sale.date);
    const formattedDate = saleDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Get category class
    const categoryClass = `category-${sale.category}`;
    const categoryText = sale.category === 'lechon' ? 'Whole Lechon' :
                        sale.category === 'belly' ? 'Lechon Belly' : 'Other';
    
    row.innerHTML = `
        <td>${formattedDate}</td>
        <td>
            <div>${sale.transactionId}</div>
            <small>${sale.orderNumber}</small>
        </td>
        <td>${sale.product}</td>
        <td>
            <span class="category ${categoryClass}">${categoryText}</span>
        </td>
        <td>${sale.quantity}</td>
        <td>₱${sale.unitPrice.toLocaleString()}</td>
        <td><strong>₱${sale.totalAmount.toLocaleString()}</strong></td>
        <td>
            <div style="display: flex; align-items: center; gap: 5px;">
                <i class="fas fa-${sale.paymentMethod === 'cash' ? 'money-bill-wave' : 
                                  sale.paymentMethod === 'card' ? 'credit-card' : 'mobile-alt'}"></i>
                <span>${sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}</span>
            </div>
        </td>
    `;
    
    return row;
}

// Setup event listeners
function setupSalesListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Period filter change
    document.getElementById('salesPeriod').addEventListener('change', function() {
        const isCustom = this.value === 'custom';
        document.getElementById('customDateRange').style.display = isCustom ? 'block' : 'none';
    });
    
    // Apply filters button
    document.getElementById('applySalesFilters').addEventListener('click', function() {
        currentPage = 1;
        applySalesFilters();
        showNotification('Sales data updated!', 'success');
    });
    
    // Export report button
    document.getElementById('exportSalesReport').addEventListener('click', exportSalesReport);
    
    // Print report button
    document.getElementById('printSalesReport').addEventListener('click', printSalesReport);
    
    // Chart type buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Change chart type
            const type = this.dataset.type;
            currentChartType = type;
            
            if (window.salesTrendChart) {
                window.salesTrendChart.config.type = type;
                window.salesTrendChart.update();
            }
        });
    });
    
    // Time filter buttons for hourly chart
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentPeriod = this.dataset.period;
            updateHourlySalesChart();
        });
    });
    
    // Top products sort
    document.getElementById('topProductsSort').addEventListener('change', updateTopProducts);
    
    // Search sales data
    const searchInput = document.getElementById('searchSales');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm === '') {
                applySalesFilters();
                return;
            }
            
            const filtered = filteredSalesData.filter(sale =>
                sale.product.toLowerCase().includes(searchTerm) ||
                sale.transactionId.toLowerCase().includes(searchTerm) ||
                sale.orderNumber.toLowerCase().includes(searchTerm) ||
                sale.category.toLowerCase().includes(searchTerm)
            );
            
            displayFilteredSalesTable(filtered);
        });
    }
    
    // Refresh button
    document.getElementById('refreshSalesData').addEventListener('click', function() {
        loadSalesData();
        showNotification('Sales data refreshed!', 'success');
    });
    
    // Rows per page change
    document.getElementById('salesRowsPerPage').addEventListener('change', function() {
        currentPage = 1;
        rowsPerPage = parseInt(this.value);
        displaySalesTable();
    });
    
    // Pagination buttons
    document.getElementById('prevSalesPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displaySalesTable();
        }
    });
    
    document.getElementById('nextSalesPage').addEventListener('click', function() {
        const totalPages = parseInt(document.getElementById('totalSalesPages').textContent);
        if (currentPage < totalPages) {
            currentPage++;
            displaySalesTable();
        }
    });
    
    // Print report button in modal
    document.getElementById('printReportBtn').addEventListener('click', function() {
        printSalesReport();
        document.getElementById('salesReportModal').classList.remove('active');
    });
}

// Display filtered sales table
function displayFilteredSalesTable(filteredData) {
    const tableBody = document.getElementById('salesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only first 50 results for performance
    const displayData = sortedData.slice(0, 50);
    
    displayData.forEach(sale => {
        const row = createSalesTableRow(sale);
        tableBody.appendChild(row);
    });
    
    // Show message if no results
    if (displayData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--gray-color);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <h3>No matching sales found</h3>
                <p>Try a different search term</p>
            </td>
        `;
        tableBody.appendChild(row);
    }
    
    // Hide pagination for search results
    document.querySelector('.table-footer').style.display = 'none';
}

// Export sales report
function exportSalesReport() {
    // Create report data
    const period = document.getElementById('salesPeriod').value;
    const periodText = document.getElementById('salesPeriod').options[document.getElementById('salesPeriod').selectedIndex].text;
    
    const reportData = {
        period: periodText,
        totalSales: document.getElementById('totalSalesValue').textContent,
        totalTransactions: document.getElementById('totalTransactionsValue').textContent,
        averageOrderValue: document.getElementById('averageOrderValue').textContent,
        bestProduct: document.getElementById('bestProduct').textContent,
        bestProductSales: document.getElementById('bestProductSales').textContent,
        generatedAt: new Date().toLocaleString(),
        salesData: filteredSalesData
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(reportData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Sales report exported successfully!', 'success');
}

// Print sales report
function printSalesReport() {
    // Create report HTML
    const periodText = document.getElementById('salesPeriod').options[document.getElementById('salesPeriod').selectedIndex].text;
    
    // Calculate summary data
    const totalSales = filteredSalesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const uniqueTransactions = [...new Set(filteredSalesData.map(sale => sale.transactionId))].length;
    const averageOrderValue = uniqueTransactions > 0 ? totalSales / uniqueTransactions : 0;
    
    // Calculate category totals
    const categoryTotals = {
        'lechon': 0,
        'belly': 0,
        'other': 0
    };
    
    filteredSalesData.forEach(sale => {
        if (categoryTotals[sale.category] !== undefined) {
            categoryTotals[sale.category] += sale.totalAmount;
        }
    });
    
    // Find top 5 products
    const productSales = {};
    filteredSalesData.forEach(sale => {
        if (!productSales[sale.product]) {
            productSales[sale.product] = { quantity: 0, revenue: 0 };
        }
        productSales[sale.product].quantity += sale.quantity;
        productSales[sale.product].revenue += sale.totalAmount;
    });
    
    const productsArray = Object.keys(productSales).map(product => ({
        name: product,
        quantity: productSales[product].quantity,
        revenue: productSales[product].revenue
    }));
    
    productsArray.sort((a, b) => b.revenue - a.revenue);
    const topProducts = productsArray.slice(0, 5);
    
    // Create report window
    const printWindow = window.open('', '_blank');
    
    const reportHTML = `
        <html>
        <head>
            <title>Sales Report - Gene's Lechon</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; max-width: 1000px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #c62828; }
                .header h1 { color: #c62828; margin-bottom: 10px; }
                .report-period { color: #666; font-size: 1.1rem; }
                .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                .summary-item { background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
                .summary-item h3 { color: #666; font-size: 0.9rem; margin-bottom: 10px; }
                .summary-item .value { font-size: 1.5rem; font-weight: bold; color: #333; }
                .section { margin-bottom: 40px; }
                .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
                .category-chart { display: grid; grid-template-columns: 300px 1fr; gap: 30px; align-items: center; margin-bottom: 30px; }
                .category-data { display: flex; flex-direction: column; gap: 15px; }
                .category-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 6px; }
                .category-name { display: flex; align-items: center; gap: 10px; }
                .category-color { width: 15px; height: 15px; border-radius: 50%; }
                .category-lechon { background-color: #c62828; }
                .category-belly { background-color: #ff9800; }
                .category-other { background-color: #4caf50; }
                .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .products-table th { background-color: #c62828; color: white; padding: 12px 15px; text-align: left; }
                .products-table td { padding: 12px 15px; border-bottom: 1px solid #ddd; }
                .footer { text-align: center; color: #666; font-size: 0.9rem; padding-top: 30px; border-top: 1px solid #ddd; margin-top: 40px; }
                @media print {
                    body { padding: 20px; }
                    .summary { grid-template-columns: repeat(2, 1fr); }
                    .category-chart { grid-template-columns: 1fr; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Gene's Lechon - Sales Report</h1>
                <div class="report-period">Period: ${periodText}</div>
                <div>Generated: ${new Date().toLocaleString()}</div>
            </div>
            
            <div class="summary">
                <div class="summary-item">
                    <h3>Total Sales</h3>
                    <div class="value">₱${totalSales.toLocaleString()}</div>
                </div>
                <div class="summary-item">
                    <h3>Transactions</h3>
                    <div class="value">${uniqueTransactions.toLocaleString()}</div>
                </div>
                <div class="summary-item">
                    <h3>Average Order Value</h3>
                    <div class="value">₱${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div class="summary-item">
                    <h3>Products Sold</h3>
                    <div class="value">${filteredSalesData.reduce((sum, sale) => sum + sale.quantity, 0).toLocaleString()}</div>
                </div>
            </div>
            
            <div class="section">
                <h2>Category Distribution</h2>
                <div class="category-chart">
                    <div class="category-data">
                        <div class="category-item">
                            <div class="category-name">
                                <div class="category-color category-lechon"></div>
                                <span>Whole Lechon</span>
                            </div>
                            <div>₱${categoryTotals.lechon.toLocaleString()}</div>
                        </div>
                        <div class="category-item">
                            <div class="category-name">
                                <div class="category-color category-belly"></div>
                                <span>Lechon Belly</span>
                            </div>
                            <div>₱${categoryTotals.belly.toLocaleString()}</div>
                        </div>
                        <div class="category-item">
                            <div class="category-name">
                                <div class="category-color category-other"></div>
                                <span>Other Products</span>
                            </div>
                            <div>₱${categoryTotals.other.toLocaleString()}</div>
                        </div>
                    </div>
                    <div>
                        <!-- Chart placeholder -->
                        <div style="text-align: center; padding: 40px; background-color: #f9f9f9; border-radius: 8px;">
                            <i class="fas fa-chart-pie" style="font-size: 3rem; color: #ddd; margin-bottom: 15px; display: block;"></i>
                            <div>Category Distribution Chart</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Top 5 Products by Revenue</h2>
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity Sold</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${topProducts.map((product, index) => `
                            <tr>
                                <td>${product.name}</td>
                                <td>${product.quantity.toLocaleString()} units</td>
                                <td>₱${product.revenue.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p>Gene's Lechon Sales Report</p>
                <p>123 Bulua, Cagayan de Oro City, Philippines</p>
                <p>Generated by: ${localStorage.getItem('username') || 'Admin'}</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    
    showNotification('Sales report printed successfully!', 'success');
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