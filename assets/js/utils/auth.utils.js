// CryptoJS is loaded globally from the CDN in login.html
// A constant encryption key (in production, this should be properly managed and not hardcoded)
const ENCRYPTION_KEY = 'JH-Dashboard-Secret-Key-2025';

/**
 * Encrypts sensitive data before storing in session storage
 * @param {string} data - The data to encrypt
 * @returns {string} - The encrypted data
 */
export function encryptData(data) {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts data from session storage
 * @param {string} encryptedData - The encrypted data to decrypt
 * @returns {string} - The decrypted data
 */
export function decryptData(encryptedData) {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Securely stores credentials in session storage
 * @param {string} userID - The user ID to store
 * @param {string} password - The password to store
 */
export function secureStoreCredentials(userID, password) {
    sessionStorage.setItem('temp_userID', encryptData(userID));
    sessionStorage.setItem('temp_password', encryptData(password));
}

/**
 * Retrieves securely stored credentials
 * @returns {{userID: string, password: string}} - The decrypted credentials
 */
export function getSecureCredentials() {
    const encryptedUserID = sessionStorage.getItem('temp_userID');
    const encryptedPassword = sessionStorage.getItem('temp_password');
    
    return {
        userID: decryptData(encryptedUserID),
        password: decryptData(encryptedPassword)
    };
}
