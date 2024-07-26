import axios from 'axios';
import {
	BackEndBase,
	clearData,
	setUser,
	setToken,
} from '../constants';
import { newLogin } from './helpers';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const signUpRequest = async (name, email, pass) => {
	console.log(name, email, pass);
	const res = await instance.post('signUp', {
		name,
		email,
		password: pass,
	});

	console.log(res);

	let { token, user } = res.data;
	token = `Bearer ${token}`;
	console.log(token);
	console.log(user);

	if (token) {
		clearData();
		setToken(token);
		setUser(user);
		newLogin();
	} else {
		throw new Error('Sign Up Failed');
	}
};
