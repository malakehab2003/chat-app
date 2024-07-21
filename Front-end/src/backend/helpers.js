import axios from 'axios';
import { BackEndBase, getToken } from '../constants';

// Function to create an axios instance with custom baseURL and headers
export const createAxiosInstance = (baseURL, headers) => {
	return axios.create({
		baseURL: `${BackEndBase}${baseURL}`,
		headers,
	});
};

let userChanged = false;

export const newLogin = () => {
	userChanged = true;
};
export const clearLoginFlag = () => {
	userChanged = false;
};
export const isUserChanged = () => {
	return userChanged;
};

export const createAuthorizedAxiosInstance = (baseURL) => {
	const token = getToken();
	return createAxiosInstance(baseURL, {
		Authorization: token,
	});
};
