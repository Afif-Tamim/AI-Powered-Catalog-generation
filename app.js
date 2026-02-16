// ============================================================
// APPLICATION STATE
// ============================================================
const AppState = {
    currentView: 'dashboard',
    currentStep: 0,
    user: {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'Admin'
    },
    products: [],
    searchQuery: ''
};

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_PRODUCT_DATA = {
    products: [
        {
            id: 1,
            title: "Wireless Bluetooth Headphones",
            description: "Premium noise-cancelling headphones with 30-hour battery life and superior sound quality.",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            confidence: 0.94,
            sources: ["Amazon", "Alibaba"]
        },
        {
            id: 2,
            title: "Smart Watch Pro",
            description: "Advanced fitness tracking with heart rate monitor, GPS, and waterproof design.",
            price: 299.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            confidence: 0.91,
            sources: ["Amazon", "Google"]
        },
        {
            id: 3,
            title: "Portable Power Bank",
            description: "20000mAh high-capacity power bank with fast charging and dual USB ports.",
            price: 39.99,
            image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
            confidence: 0.88,
            sources: ["Alibaba"]
        },
        {
            id: 4,
            title: "4K Action Camera",
            description: "Waterproof action camera with image stabilization and wide-angle lens.",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
            confidence: 0.96,
            sources: ["Amazon", "Google"]
        },
        {
            id: 5,
            title: "Mechanical Keyboard RGB",
            description: "Gaming keyboard with customizable RGB lighting and mechanical switches.",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
            confidence: 0.92,
            sources: ["Amazon", "Alibaba"]
        },
        {
            id: 6,
            title: "Wireless Gaming Mouse",
            description: "High-precision gaming mouse with adjustable DPI and programmable buttons.",
            price: 59.99,
            image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
            confidence: 0.89,
            sources: ["Google"]
        }
    ],
    sources: [
        { name: "Amazon", trustScore: 94, color: "#FF9900" },
        { name: "Alibaba", trustScore: 87, color: "#FF6A00" },
        { name: "Google", trustScore: 91, color: "#4285F4" }
    ],
    stats: {
        totalProducts: 1247,
        aiDescriptions: 89,
        avgTime: "3.2 min",
        successRate: "94.7%"
    }
};

// ============================================================
// ICON GENERATOR
// ============================================================
function getIcon(name, size = 20, color = 'currentColor') {
    const icons = {
        search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
        barcode: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14M21 5v14"/></svg>`,
        upload: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        camera: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
        sparkle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
        grid: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
        chart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        download: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        tag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
        settings: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>`,
        package: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        zap: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        copy: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        fileText: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        image: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
        clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    };
    return icons[name] || '';
}

// ============================================================
// VIEW RENDERERS
// ============================================================
function renderDashboard() {
    return `
        <div class="animate-fadeIn">
            <!-- Stats Grid -->
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        ${getIcon('package', 24, '#3B82F6')}
                        <span class="trend-badge trend-up">+12%</span>
                    </div>
                    <div class="stat-value">${MOCK_PRODUCT_DATA.stats.totalProducts}</div>
                    <div class="stat-label">Total Products</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        ${getIcon('sparkle', 24, '#10B981')}
                        <span class="trend-badge trend-up">+5%</span>
                    </div>
                    <div class="stat-value">${MOCK_PRODUCT_DATA.stats.aiDescriptions}%</div>
                    <div class="stat-label">AI Descriptions Used</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        ${getIcon('zap', 24, '#F59E0B')}
                        <span class="trend-badge trend-down">-40%</span>
                    </div>
                    <div class="stat-value">${MOCK_PRODUCT_DATA.stats.avgTime}</div>
                    <div class="stat-label">Avg Time per Product</div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="card" style="margin-bottom: 24px;">
                <div class="card-header">
                    <h2 class="card-title">Quick Actions</h2>
                </div>
                <div class="quick-actions">
                    <a href="#" class="action-card" onclick="handleNewCatalog(event)">
                        <div class="action-icon" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.15));">
                            ${getIcon('barcode', 24, '#3B82F6')}
                        </div>
                        <h3 class="action-title">New Product Catalog</h3>
                        <p class="action-description">Search and import products from multiple sources</p>
                    </a>
                    
                    <a href="#" class="action-card" onclick="handleBulkUpload(event)">
                        <div class="action-icon" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));">
                            ${getIcon('upload', 24, '#F59E0B')}
                        </div>
                        <h3 class="action-title">Bulk Upload</h3>
                        <p class="action-description">Upload CSV or Excel files for batch processing</p>
                    </a>
                    
                    <a href="#" class="action-card" onclick="handleImageScan(event)">
                        <div class="action-icon" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15));">
                            ${getIcon('camera', 24, '#8B5CF6')}
                        </div>
                        <h3 class="action-title">Image Scan</h3>
                        <p class="action-description">Upload product images for AI recognition</p>
                    </a>
                    
                    <a href="#" class="action-card" onclick="handleViewAnalytics(event)">
                        <div class="action-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15));">
                            ${getIcon('chart', 24, '#10B981')}
                        </div>
                        <h3 class="action-title">View Analytics</h3>
                        <p class="action-description">Track performance and data insights</p>
                    </a>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Products</h2>
                    <button class="btn btn-sm btn-ghost">View All</button>
                </div>
                <div class="product-grid">
                    ${MOCK_PRODUCT_DATA.products.slice(0, 3).map(product => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.title}" class="product-image">
                            <div class="product-info">
                                <h3 class="product-title">${product.title}</h3>
                                <p class="product-description">${product.description}</p>
                                <div class="product-meta">
                                    <span class="product-price">$${product.price}</span>
                                    <div class="confidence-score">
                                        ${getIcon('star', 14, '#F59E0B')}
                                        <span>${Math.round(product.confidence * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderStepIndicator(currentStep) {
    const steps = ['Search', 'Review', 'Export'];
    return `
        <div class="step-indicator">
            ${steps.map((step, index) => `
                <div class="step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}">
                    <div class="step-circle">
                        ${index < currentStep ? getIcon('check', 16) : index + 1}
                    </div>
                    <span class="step-label">${step}</span>
                    ${index < steps.length - 1 ? '<div class="step-connector"></div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderSearchStep() {
    return `
        <div class="animate-fadeIn">
            <div class="search-container">
                <div class="search-card">
                    <div class="search-header">
                        <h2>Search Products</h2>
                        <p>Enter a product name or category to search across multiple sources</p>
                    </div>
                    
                    <div class="search-input-group">
                        <input 
                            type="text" 
                            id="product-search-input"
                            class="search-input" 
                            placeholder="e.g., wireless headphones, laptop, camera..."
                            value="${AppState.searchQuery}"
                        >
                        <button class="btn btn-primary btn-sm search-btn" onclick="handleSearchSubmit()">
                            ${getIcon('search', 16)}
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0; color: #64748B; font-size: 13px;">
                        OR
                    </div>
                    
                    <div class="upload-methods">
                        <div class="upload-option" onclick="handleFileUpload()">
                            ${getIcon('upload', 32, '#3B82F6')}
                            <span>Upload File</span>
                        </div>
                        <div class="upload-option" onclick="handleImageUpload()">
                            ${getIcon('camera', 32, '#10B981')}
                            <span>Scan Image</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; padding: 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; font-size: 13px; color: #10B981;">
                        ${getIcon('sparkle', 16, '#10B981')}
                        <strong>AI-Powered:</strong> Results include enriched descriptions, pricing, and source verification
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderReviewStep() {
    return `
        <div class="animate-fadeIn">
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="font-size: 24px; font-weight: 800; margin: 0;">Review Results</h2>
                    <p style="color: #94A3B8; margin: 4px 0 0 0;">Found ${MOCK_PRODUCT_DATA.products.length} products for "${AppState.searchQuery}"</p>
                </div>
                <button class="btn btn-success" onclick="handleExportClick()">
                    ${getIcon('download', 16)}
                    Export Catalog
                </button>
            </div>
            
            <div class="product-grid">
                ${MOCK_PRODUCT_DATA.products.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}" class="product-image">
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <p class="product-description">${product.description}</p>
                            <div style="display: flex; gap: 6px; margin: 12px 0;">
                                ${product.sources.map(source => `
                                    <span class="source-badge" style="background: ${MOCK_PRODUCT_DATA.sources.find(s => s.name === source)?.color}20; color: ${MOCK_PRODUCT_DATA.sources.find(s => s.name === source)?.color};">
                                        ${source}
                                    </span>
                                `).join('')}
                            </div>
                            <div class="product-meta">
                                <span class="product-price">$${product.price}</span>
                                <div class="confidence-score">
                                    ${getIcon('star', 14, '#F59E0B')}
                                    <span>${Math.round(product.confidence * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderExportStep() {
    return `
        <div class="animate-fadeIn">
            <div class="export-container">
                <div class="card">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">Export Your Catalog</h2>
                        <p style="color: #94A3B8; margin: 0;">Choose your preferred export format</p>
                    </div>
                    
                    <div class="export-options">
                        <div class="export-option" onclick="handleExportFormat('csv')">
                            ${getIcon('fileText', 40, '#10B981')}
                            <h3>CSV File</h3>
                            <p>Standard spreadsheet format</p>
                        </div>
                        
                        <div class="export-option" onclick="handleExportFormat('excel')">
                            ${getIcon('grid', 40, '#3B82F6')}
                            <h3>Excel File</h3>
                            <p>Advanced formatting & formulas</p>
                        </div>
                        
                        <div class="export-option" onclick="handleExportFormat('json')">
                            ${getIcon('copy', 40, '#8B5CF6')}
                            <h3>JSON</h3>
                            <p>Developer-friendly format</p>
                        </div>
                        
                        <div class="export-option" onclick="handleExportFormat('pdf')">
                            ${getIcon('fileText', 40, '#F59E0B')}
                            <h3>PDF Report</h3>
                            <p>Print-ready document</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 24px; text-align: center;">
                        <button class="btn btn-ghost" onclick="handleBackToReview()">
                            Back to Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAnalytics() {
    return `
        <div class="animate-fadeIn">
            <div class="analytics-grid">
                <div class="card">
                    <div style="display: flex; justify-content: space-between;">
                        ${getIcon('clock', 18, '#3B82F6')}
                        <span style="font-size: 11px; color: #10B981; font-weight: 700;">-40%</span>
                    </div>
                    <div style="font-size: 28px; font-weight: 800; font-family: 'DM Mono', monospace; margin: 8px 0;">3.2 min</div>
                    <div style="font-size: 12px; color: #64748B;">Avg Time per Product</div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between;">
                        ${getIcon('check', 18, '#10B981')}
                        <span style="font-size: 11px; color: #10B981; font-weight: 700;">+2.1%</span>
                    </div>
                    <div style="font-size: 28px; font-weight: 800; font-family: 'DM Mono', monospace; margin: 8px 0;">94.7%</div>
                    <div style="font-size: 12px; color: #64748B;">Success Rate</div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between;">
                        ${getIcon('sparkle', 18, '#F59E0B')}
                        <span style="font-size: 11px; color: #10B981; font-weight: 700;">+5%</span>
                    </div>
                    <div style="font-size: 28px; font-weight: 800; font-family: 'DM Mono', monospace; margin: 8px 0;">89%</div>
                    <div style="font-size: 12px; color: #64748B;">AI Descriptions Used</div>
                </div>
            </div>
            
            <div class="card" style="margin-top: 20px; padding: 24px;">
                <h3 style="font-weight: 700; margin-bottom: 20px;">Data Source Performance</h3>
                ${MOCK_PRODUCT_DATA.sources.map(source => `
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
                        <div style="width: 100px; font-size: 13px; font-weight: 600;">${source.name}</div>
                        <div style="flex: 1;">
                            <div class="progress-bar" style="height: 8px;">
                                <div class="progress-fill" style="width: ${source.trustScore}%; background: ${source.color};"></div>
                            </div>
                        </div>
                        <span style="width: 44px; text-align: right; font-family: 'DM Mono', monospace; font-size: 13px; color: ${source.color};">${source.trustScore}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderEmptyState(view) {
    const content = {
        voices: {
            icon: 'tag',
            title: 'Brand Voice Manager',
            description: 'This section is fully functional in the production build.'
        },
        settings: {
            icon: 'settings',
            title: 'Settings',
            description: 'This section is fully functional in the production build.'
        }
    };
    
    const config = content[view];
    return `
        <div class="animate-fadeIn card empty-state">
            ${getIcon(config.icon, 40, '#475569')}
            <h3>${config.title}</h3>
            <p>${config.description}</p>
        </div>
    `;
}

// ============================================================
// EVENT HANDLERS
// ============================================================
function handleLogin(e) {
    e.preventDefault();
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    updateView('dashboard');
}

function handleLogout() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-form').reset();
}

function handleNewCatalog(e) {
    e.preventDefault();
    AppState.currentStep = 0;
    updateView('catalog');
}

function handleBulkUpload(e) {
    e.preventDefault();
    alert('Bulk upload feature - would open file picker for CSV/Excel files');
}

function handleImageScan(e) {
    e.preventDefault();
    alert('Image scan feature - would open camera or file picker for images');
}

function handleViewAnalytics(e) {
    e.preventDefault();
    updateView('analytics');
}

function handleSearchSubmit() {
    const input = document.getElementById('product-search-input');
    if (input && input.value.trim()) {
        AppState.searchQuery = input.value.trim();
        AppState.currentStep = 1;
        updateView('catalog');
    }
}

function handleFileUpload() {
    alert('File upload feature - would open file picker');
}

function handleImageUpload() {
    alert('Image upload feature - would open camera or file picker');
}

function handleExportClick() {
    AppState.currentStep = 2;
    updateView('catalog');
}

function handleBackToReview() {
    AppState.currentStep = 1;
    updateView('catalog');
}

function handleExportFormat(format) {
    alert(`Exporting catalog as ${format.toUpperCase()} file...`);
    setTimeout(() => {
        alert('Export complete! File would be downloaded.');
        AppState.currentStep = 0;
        updateView('dashboard');
    }, 1000);
}

function updateView(view) {
    AppState.currentView = view;
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === view) {
            item.classList.add('active');
        }
    });
    
    // Update header
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Overview of your catalog operations' },
        catalog: { title: 'New Catalog', subtitle: 'Search and import products' },
        analytics: { title: 'Analytics', subtitle: 'Performance insights and metrics' },
        voices: { title: 'Brand Voices', subtitle: 'Manage your brand voice settings' },
        settings: { title: 'Settings', subtitle: 'Configure your preferences' }
    };
    
    const headerInfo = titles[view];
    document.getElementById('header-title').textContent = headerInfo.title;
    document.querySelector('.header-subtitle').textContent = headerInfo.subtitle;
    
    // Update content
    const contentArea = document.getElementById('content-area');
    
    if (view === 'dashboard') {
        contentArea.innerHTML = renderDashboard();
    } else if (view === 'catalog') {
        let content = renderStepIndicator(AppState.currentStep);
        if (AppState.currentStep === 0) {
            content += renderSearchStep();
        } else if (AppState.currentStep === 1) {
            content += renderReviewStep();
        } else if (AppState.currentStep === 2) {
            content += renderExportStep();
        }
        contentArea.innerHTML = content;
        
        // Add enter key listener for search
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearchSubmit();
                }
            });
            searchInput.focus();
        }
    } else if (view === 'analytics') {
        contentArea.innerHTML = renderAnalytics();
    } else if (view === 'voices' || view === 'settings') {
        contentArea.innerHTML = renderEmptyState(view);
    }
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Navigation handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view === 'catalog') {
                AppState.currentStep = 0;
            }
            updateView(view);
        });
    });
    
    // Initialize with dashboard view (when logged in)
    updateView('dashboard');
});
