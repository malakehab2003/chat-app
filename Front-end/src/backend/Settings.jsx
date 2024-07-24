import axios from 'axios';
import { BackEndBase, getToken, clearData } from '../constants';

const instance = axios.create({
	baseURL: `${BackEndBase}user`,
});

export const updateName = async (name) => {
  const res = await instance.post('changeName', {
    name
  }, {
    headers: {
      Authorization: getToken(),
    },
  });
}

export const deleteAcc = async () => {
  const res = await instance.delete('', {
    headers: {
      Authorization: getToken(),
    }
  })

  clearData();
}
