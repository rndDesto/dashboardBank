const TOKEN_STORAGE = 'tunaiku_access_token';
const GLOBAL_ACCOUNT = 'global_account';
export function setToken(value) {
    localStorage.setItem(TOKEN_STORAGE, value);
}
export function setAccount(value) {
    localStorage.setItem(GLOBAL_ACCOUNT, value);
}

export function getToken() {
    return localStorage.getItem(TOKEN_STORAGE);
}

export function getAccount() {
    return localStorage.getItem(GLOBAL_ACCOUNT);
}

export function clearStorages() {
    localStorage.removeItem(TOKEN_STORAGE);
    localStorage.removeItem(GLOBAL_ACCOUNT);
}