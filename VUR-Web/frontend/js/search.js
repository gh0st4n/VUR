// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api/v1'
    : 'https://your-backend-url.com/api/v1';

// Get search query from URL
function getSearchQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
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

// Create Search Result Item
function createSearchResultItem(package) {
    const statusClass = package.status === 'maintained' ? 'status-maintained' : 'status-orphan';
    const outOfDateClass = package.out_of_date ? 'status-outdated' : '';
    
    return `
        <div class="package-card">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex-1">
                    <h3 class="package-name mb-2">
                        <a href="package.html?name=${encodeURIComponent(package.name)}">
                            ${package.name}
                        </a>
                    </h3>
                    <p class="package-description mb-3">${package.description || 'No description available'}</p>
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
                            <span>Updated:</span>
                            <span>${formatDate(package.last_update)}</span>
                        </div>
                        <div class="package-meta-item">
                            <span class="status-badge ${statusClass} ${outOfDateClass}">
                                ${package.out_of_date ? 'Out of Date' : package.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="mt-4 lg:mt-0 lg:ml-6">
                    <a href="package.html?name=${encodeURIComponent(package.name)}" 
                       class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Perform Search
async function performSearch(query) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    
    // Show loading
    loadingSpinner.classList.remove('hidden');
    searchResults.innerHTML = '';
    noResults.classList.add('hidden');
    
    try {
        const results = await fetchAPI(`/search?q=${encodeURIComponent(query)}&limit=50`);
        
        // Hide loading
        loadingSpinner.classList.add('hidden');
        
        // Update result count
        resultCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(pkg => createSearchResultItem(pkg)).join('');
        } else {
            noResults.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Search failed:', error);
        loadingSpinner.classList.add('hidden');
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-500">Search failed. Please try again later.</p>
            </div>
        `;
    }
}

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Get initial query from URL
    const initialQuery = getSearchQueryFromURL();
    const searchInput = document.getElementById('searchInput');
    const searchQuery = document.getElementById('searchQuery');
    
    if (initialQuery) {
        searchInput.value = initialQuery;
        searchQuery.textContent = `Search Results for "${initialQuery}"`;
        performSearch(initialQuery);
    } else {
        searchQuery.textContent = 'Search Packages';
        document.getElementById('resultCount').textContent = 'Enter a search term';
    }
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Update URL without page reload
                const newURL = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
                window.history.pushState({}, '', newURL);
                
                // Update UI
                searchQuery.textContent = `Search Results for "${query}"`;
                performSearch(query);
            }
        });
    }
});
