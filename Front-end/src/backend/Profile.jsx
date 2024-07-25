import axios from 'axios';
import { BackEndBase } from '../constants';
import { getToken, getId } from '../constants';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const getUser = async (id) => {
  try {
    const res = await instance.post('id', {
      id,
    }, {
      headers: {
        Authorization: getToken(),
      },
    });
  
    return res.data;
  } catch (err) {
    console.error('can\'t get user err: ', err);
  }
}
