// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api/v1'
    : 'https://your-backend-url.com/api/v1';

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.documentElement.className;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

// API Functions
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Create Package Card
function createPackageCard(package) {
    const statusClass = package.status === 'maintained' ? 'status-maintained' : 'status-orphan';
    const outOfDateClass = package.out_of_date ? 'status-outdated' : '';
    
    return `
        <div class="package-card">
            <h3 class="package-name">
                <a href="package.html?name=${encodeURIComponent(package.name)}">
                    ${package.name}
                </a>
            </h3>
            <p class="package-description">${package.description || 'No description available'}</p>
            <div class="package-meta">
                <div class="package-meta-item">
                    <span>Version:</span>
                    <span class="font-mono">${package.version}</span>
                </div>
                <div class="package-meta-item">
                    <span>Maintainer:</span>
                    <span>${package.maintainer || 'Unknown'}</span>
                </div>
                <div class="package-meta-item">
                    <span class="status-badge ${statusClass} ${outOfDateClass}">
                        ${package.out_of_date ? 'Out of Date' : package.status}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load statistics
    try {
        const packages = await fetchAPI('/packages?limit=1000');
        
        // Update statistics
        document.getElementById('totalPackages').textContent = packages.length;
        document.getElementById('maintainedPackages').textContent = 
            packages.filter(p => p.status === 'maintained').length;
        document.getElementById('orphanPackages').textContent = 
            packages.filter(p => p.status === 'orphan').length;
        
        // Load recent packages
        const recentPackages = packages
            .sort((a, b) => new Date(b.last_update) - new Date(a.last_update))
            .slice(0, 9);
        
        const packagesList = document.getElementById('packagesList');
        packagesList.innerHTML = recentPackages.map(pkg => createPackageCard(pkg)).join('');
        
    } catch (error) {
        console.error('Failed to load packages:', error);
        document.getElementById('packagesList').innerHTML = 
            '<p class="text-red-500">Failed to load packages. Please try again later.</p>';
    }
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
});
