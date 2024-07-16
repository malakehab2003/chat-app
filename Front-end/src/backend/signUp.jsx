import axios from 'axios';
import { BackEndBase } from '../constants';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const signUpRequest = async (name, email, pass) => {
  try {
    console.log(name, email, pass);
    const res = await instance.post('signUp', {
      name,
      email,
      password: pass
    });

    console.log(res);

    let { token } = res.data;
    token = `Bearer ${token}`;
    console.log(token);

    if (token) {
      localStorage.setItem('token', token);
    }

  } catch (error) {
    console.error('Error during sign-up:', error);
  }
};

