import axios from 'axios';
import { BackEndBase } from '../constants';
import { token } from '../constants';
const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const changePassRequest = async (oldPass, newPass) => {
  console.log(oldPass, newPass);
	const res = await instance.post('changePass', {
		oldPass,
		newPass,
	}, {
    headers: {
      Authorization: token,
    },
  });
	console.log(res);
};
