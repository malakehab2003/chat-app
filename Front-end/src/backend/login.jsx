import axios from 'axios';
import {
	BackEndBase,
	clearData,
	setToken,
	setUser,
} from '../constants';
import { newLogin } from './helpers';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const SignInRequest = async (email, pass) => {
	console.log(email, pass);

	const res = await instance.post('signIn', {
		email,
		pass,
	});
	console.log(res);

	let { token, user } = res.data;
	token = `Bearer ${token}`;
	console.log(token);

	if (token) {
		clearData();
		setToken(token);
		setUser(user);
		newLogin();
	} else {
		throw new Error('Sign in Failed');
	}
};
