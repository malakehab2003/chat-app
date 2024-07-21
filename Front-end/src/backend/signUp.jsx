import axios from 'axios';
import { BackEndBase } from '../constants';
import { setId, setToken } from '../constants';
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

	let { token, id } = res.data;
	token = `Bearer ${token}`;
	console.log(token);

	if (token) {
		setToken(token);
		setId(id);
		newLogin();
	} else {
		throw new Error('Sign Up Failed');
	}
};
