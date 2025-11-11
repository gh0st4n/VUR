// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api/v1'
    : 'https://your-backend-url.com/api/v1';

// Get package name from URL
function getPackageNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('name');
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Load Package Details
async function loadPackageDetails() {
    const packageName = getPackageNameFromURL();
    if (!packageName) {
        showError();
        return;
    }
    
    try {
        const package = await fetchAPI(`/package/${encodeURIComponent(packageName)}`);
        displayPackageDetails(package);
    } catch (error) {
        console.error('Failed to load package:', error);
        showError();
    }
}

// Display Package Details
function displayPackageDetails(package) {
    // Update page title
    document.getElementById('pageTitle').textContent = `${package.name} - VUR`;
    document.getElementById('breadcrumbName').textContent = package.name;
    
    // Package header
    document.getElementById('packageName').textContent = package.name;
    document.getElementById('packageDescription').textContent = 
        package.description || 'No description available';
    document.getElementById('packageVersion').textContent = package.version;
    document.getElementById('packageLicense').textContent = package.license || 'Unknown';
    document.getElementById('packageMaintainer').textContent = package.maintainer || 'Unknown';
    document.getElementById('packageLastUpdate').textContent = formatDate(package.last_update);
    
    // Status badge
    const statusElement = document.getElementById('packageStatus');
    const isOutdated = package.out_of_date;
    let statusText = package.status;
    let statusClass = package.status === 'maintained' ? 'status-maintained' : 'status-orphan';
    
    if (isOutdated) {
        statusText = 'Out of Date';
        statusClass = 'status-outdated';
    }
    
    statusElement.textContent = statusText;
    statusElement.className = `status-badge ${statusClass}`;
    
    // Homepage
    const homepageLink = document.getElementById('packageHomepage');
    if (package.homepage) {
        homepageLink.href = package.homepage;
        homepageLink.style.display = 'inline-flex';
    } else {
        homepageLink.style.display = 'none';
    }
    
    // Dependencies
    const dependenciesList = document.getElementById('dependenciesList');
    const noDependencies = document.getElementById('noDependencies');
    
    if (package.dependencies && package.dependencies.length > 0) {
        dependenciesList.innerHTML = package.dependencies.map(dep => `
            <div class="dependency-item">
                <a href="package.html?name=${encodeURIComponent(dep.name)}" class="dependency-name">
                    ${dep.name}
                </a>
                <span class="dependency-version">${dep.version}</span>
            </div>
        `).join('');
        noDependencies.classList.add('hidden');
    } else {
        dependenciesList.innerHTML = '';
        noDependencies.classList.remove('hidden');
    }
    
    // Dependents
    const dependentsList = document.getElementById('dependentsList');
    const noDependents = document.getElementById('noDependents');
    
    if (package.dependents && package.dependents.length > 0) {
        dependentsList.innerHTML = package.dependents.map(dep => `
            <div class="dependency-item">
                <a href="package.html?name=${encodeURIComponent(dep.name)}" class="dependency-name">
                    ${dep.name}
                </a>
                <span class="dependency-version">${dep.version}</span>
            </div>
        `).join('');
        noDependents.classList.add('hidden');
    } else {
        dependentsList.innerHTML = '';
        noDependents.classList.remove('hidden');
    }
    
    // Show package details, hide loading
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('packageDetails').classList.remove('hidden');
    
    // Setup action buttons
    setupActionButtons(package);
}

// Setup Action Buttons
function setupActionButtons(package) {
    // Flag as outdated
    const flagButton = document.getElementById('flagOutdated');
    if (flagButton) {
        flagButton.addEventListener('click', async () => {
            try {
                await fetchAPI(`/package/${encodeURIComponent(package.name)}/flag-outdated`, {
                    method: 'POST'
                });
                alert('Package flagged as outdated successfully!');
                location.reload();
            } catch (error) {
                alert('Failed to flag package as outdated');
            }
        });
    }
    
    // Copy install command
    const installButton = document.getElementById('installCommand');
    if (installButton) {
        installButton.addEventListener('click', () => {
            const command = `vur install ${package.name}`;
            navigator.clipboard.writeText(command).then(() => {
                const originalText = installButton.textContent;
                installButton.textContent = 'Copied!';
                installButton.classList.add('bg-green-600');
                setTimeout(() => {
                    installButton.textContent = originalText;
                    installButton.classList.remove('bg-green-600');
                }, 2000);
            });
        });
    }
}

// Show Error
function showError() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
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
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
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
    
    // Load package details
    loadPackageDetails();
});
