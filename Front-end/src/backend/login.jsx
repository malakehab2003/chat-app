import axios from 'axios';
import { BackEndBase, setId, setToken } from '../constants';

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

	let { token, id } = res.data;
	token = `Bearer ${token}`;
	console.log(token);

	if (token) {
		setToken(token);
		setId(id);
	} else {
		throw new Error('Sign in Failed');
	}
};
