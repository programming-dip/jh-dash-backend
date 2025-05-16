/**
 * Authentication related functionality
 */

// Handle logout functionality
function handleLogout() {
    // Clear all session storage
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Function to show content after authentication
function showAuthenticatedContent() {
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.classList.add('authenticated');
    }
}

// Add event listener when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Check if user is authenticated
    if (!sessionStorage.getItem('temp_userID')) {
        // If not authenticated and not on login page, redirect to login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    } else {
        // If authenticated, show the content
        showAuthenticatedContent();
    }
});
