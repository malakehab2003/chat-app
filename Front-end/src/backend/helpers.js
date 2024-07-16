import axios from 'axios';
import { BackEndBase, token } from '../constants';

// Function to create an axios instance with custom baseURL and headers
export const createAxiosInstance = (baseURL, headers) => {
	return axios.create({
		baseURL: `${BackEndBase}${baseURL}`, headers
	});
};

export const createAuthorizedAxiosInstance = (baseURL) => {
	return createAxiosInstance(baseURL, {
		Authorization: token
	});
}
