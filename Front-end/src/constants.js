export const BackEndBase = 'http://localhost:3000/api/';

let tokenConst;
let userId;

const getToken = () => {
	if (!tokenConst) {
		tokenConst = localStorage.getItem('token');
	}
	if (!tokenConst) {
		throw new Error('Sign in Required');
	}
	return tokenConst;
};

export const setToken = (param) => {
	localStorage.setItem('token', param);
	tokenConst = param;
};

const getId = () => {
	if (!userId) {
		userId = localStorage.getItem('userId');
	}
	if (!userId) {
		throw new Error('Sign in Required');
	}
	return parseInt(userId);
};

export const setId = (param) => {
	localStorage.setItem('userId', param);
	userId = param;
};

export const token = getToken();
export const id = getId();
