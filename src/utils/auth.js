const userKey = 'user'

export function getToken() {
	return JSON.parse(localStorage.getItem(userKey));
}

export function setToken(token) {
	var tokenStr = JSON.stringify(token);
	return localStorage.setItem(userKey, tokenStr)
}

export function removeToken() {
	return localStorage.remove(userKey)
}
