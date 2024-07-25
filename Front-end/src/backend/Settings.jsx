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

export const updateBio = async (bio) => {
  const res = await instance.post('changeBio', {
    bio,
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

export const updateProfilePic = async (formData) => {
  try {
    const res = await instance.post('/changeImg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: getToken(),
      }
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
}
