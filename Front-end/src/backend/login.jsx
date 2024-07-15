import axios from 'axios';
import { BackEndBase } from '../constants';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const SignInRequest = async (email, pass) => {
	try {
		console.log(email, pass);

		const res = await instance.post('signIn', {
			email,
			pass,
		});
		console.log(res);

		let { token } = res.data;
    token = `Bearer ${token}`;
    console.log(token);

    if (token) {
      localStorage.setItem('token', token);
    }
	} catch (err) {
		console.error('Error during sign-in:', err);
	}
};
