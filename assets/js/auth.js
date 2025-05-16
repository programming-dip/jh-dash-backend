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

// Add event listener when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Check if user is authenticated
    if (!sessionStorage.getItem('temp_userID') && !window.location.pathname.includes('login.html')) {
        // If not authenticated and not on login page, redirect to login
        window.location.href = 'login.html';
    }
});
