/**
 * Login page functionality
 */
import { secureStoreCredentials } from '../utils/auth.utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const userID = document.getElementById('loginUserID').value;
    const password = document.getElementById('password').value;

    // Store encrypted credentials
    secureStoreCredentials(userID, password);try {
        // Attempt to fetch data which will validate credentials
        const data = await window.fetchData();
        
        // If we got data back, authentication was successful
        if (data && Array.isArray(data)) {
            // Store auth state
            sessionStorage.setItem('isAuthenticated', 'true');
            // Redirect to dashboard
            window.location.replace('index.html');
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Invalid credentials');
        sessionStorage.removeItem('temp_userID');
        sessionStorage.removeItem('temp_password');
    }
}
