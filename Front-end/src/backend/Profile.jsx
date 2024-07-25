import axios from 'axios';
import { BackEndBase } from '../constants';
import { getToken } from '../constants';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const getUser = async () => {
  try {
    const res = await instance.get('', {
      headers: {
        Authorization: getToken(),
      },
    });
  
    return res.data;
  } catch (err) {
    console.error('can\'t get user err: ', err);
  }
}
