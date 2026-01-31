// Mobile Menu Toggle
document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

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

// Initialize Sales Trend Chart
function initSalesChart() {
    const salesTrendCtx = document.getElementById('salesTrendChart');
    if (!salesTrendCtx) return;
    
    return new Chart(salesTrendCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Sales (₱)',
                data: [28000, 32000, 35000, 40500],
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `₱${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize Category Performance Chart
function initCategoryChart() {
    const categoryCtx = document.getElementById('categoryChart');
    if (!categoryCtx) return;
    
    return new Chart(categoryCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Whole Lechon', 'Lechon Belly', 'Other Products'],
            datasets: [{
                data: [89500, 32000, 14000],
                backgroundColor: [
                    '#c62828',
                    '#ff9800',
                    '#4caf50'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ₱${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Time Period Filter
function setupFilters(salesChart) {
    const timePeriodSelect = document.getElementById('timePeriod');
    if (timePeriodSelect && salesChart) {
        timePeriodSelect.addEventListener('change', function() {
            const period = this.value;
            let newLabels = [];
            let newData = [];
            
            switch(period) {
                case 'Daily':
                    newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    newData = [5200, 6800, 7500, 8200, 7800, 9500, 6500];
                    break;
                case 'Weekly':
                    newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    newData = [28000, 32000, 35000, 40500];
                    break;
                case 'Monthly':
                    newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    newData = [125000, 118000, 132000, 145000, 128000, 135500];
                    break;
                case 'Yearly':
                    newLabels = ['2021', '2022', '2023', '2024', '2025'];
                    newData = [980000, 1120000, 1250000, 1380000, 1420000];
                    break;
            }
            
            salesChart.data.labels = newLabels;
            salesChart.data.datasets[0].data = newData;
            salesChart.update();
            
            updateMetrics(period);
        });
    }
    
    // Category Filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            alert(`Filtering by ${category}. In a real application, this would update the charts with filtered data.`);
        });
    }
}

// Update metrics based on time period
function updateMetrics(period) {
    const metricValues = document.querySelectorAll('.metric-content .value');
    
    if (metricValues.length === 0) return;
    
    switch(period) {
        case 'Daily':
            metricValues[0].textContent = '₱69,000.00';
            metricValues[1].textContent = '₱69,000.00';
            metricValues[2].textContent = '₱8,000.00';
            metricValues[3].textContent = '30';
            break;
        case 'Weekly':
            metricValues[0].textContent = '₱135,500.00';
            metricValues[1].textContent = '₱33,875.00';
            metricValues[2].textContent = '₱8,500.00';
            metricValues[3].textContent = '30';
            break;
        case 'Monthly':
            metricValues[0].textContent = '₱135,500.00';
            metricValues[1].textContent = '₱4,516.67';
            metricValues[2].textContent = '₱8,500.00';
            metricValues[3].textContent = '30';
            break;
        case 'Yearly':
            metricValues[0].textContent = '₱1,420,000.00';
            metricValues[1].textContent = '₱3,890.41';
            metricValues[2].textContent = '₱12,000.00';
            metricValues[3].textContent = '365';
            break;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    setCurrentDate();
    
    const salesChart = initSalesChart();
    initCategoryChart();
    
    if (salesChart) {
        setupFilters(salesChart);
    }
    
    // Add hover effects to hour blocks
    document.querySelectorAll('.hour-block').forEach(block => {
        block.addEventListener('mouseenter', function() {
            if (!this.classList.contains('peak') && !this.classList.contains('busy')) {
                this.style.backgroundColor = '#e0e0e0';
                this.style.transform = 'translateY(-3px)';
            }
        });
        
        block.addEventListener('mouseleave', function() {
            if (!this.classList.contains('peak') && !this.classList.contains('busy')) {
                this.style.backgroundColor = '';
                this.style.transform = '';
            }
        });
    });
});