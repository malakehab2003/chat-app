import axios from 'axios';
import { BackEndBase } from '../constants';

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
};
