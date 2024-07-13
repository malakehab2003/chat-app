import axios from 'axios';
import { BackEndBase } from '../constants';
import { redirect } from 'react-router-dom';
import { HomeRoute } from '../pages/Home';

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
