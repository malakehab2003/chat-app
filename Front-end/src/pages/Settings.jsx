import classes from './Settings.module.css';
import { NavLink } from 'react-router-dom';
import { ChangePassRoute } from './ChangePass';
import { useState } from 'react';
import { updateName, deleteAcc, updateBio, updateProfilePic } from '../backend/Settings';
import { useNavigate } from 'react-router-dom';
import { LoginRoute } from './Login';
import NavBar from './components/NavBar';

export const SettingsRoute = '/settings';

export default function Settings() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [bio, setBio] = useState('');
  const [bioError, setBioError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicError, setProfilePicError] = useState(null);
  const nav = useNavigate();

  const handleChangeName = (event) => {
    const value = event.target.value;
    setName(value);

    if (value === '') {
      setNameError('Name can\'t be empty');
    }

    setNameError(null)
  }

  const handleChangeBio = (event) => {
    const value = event.target.value;
    setBio(value);

    if (value === '') {
      setBioError('Bio can\'t be empty');
    }

    setBioError(null)
  }

  const handleChangeProfilePic = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);

    if (!file) {
      setProfilePicError('No file selected');
    } else {
      setProfilePicError(null);
    }
  };

  const handleSubmitName = (event) => {
    event.preventDefault();
    updateName(name);
  }

  const handleSubmitBio = (event) => {
    event.preventDefault();
    updateBio(bio);
  }

  const handleSubmitProfilePic = async (event) => {
    event.preventDefault();
    if (profilePic) {
      const formData = new FormData();
      formData.append('profilePic', profilePic);
      await updateProfilePic(formData);
    }
  };

  const handleDeleteAcc = (event) => {
    event.preventDefault();
    deleteAcc()
      .then(() => nav(LoginRoute));
  }

  return (
    <span className={classes.root}>
      <div className={classes['navBar']}>
        <NavBar />
      </div>
      <div className={classes['container']}>
        <h1>Edit your profile</h1>

        <div className={classes['name']}>
          <form onSubmit={handleSubmitName}>
            <p>Edit your name</p>
            <input
              className={classes['nameInput']}
              name='name'
              value={name}
              onChange={handleChangeName}
              type="text"
              placeholder='Enter your new name' />
            <input className={classes['nameBtn']} type="submit" value="Change name" />
            {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
          </form>
        </div>

        <div className={classes['bio']}>
          <form onSubmit={handleSubmitBio}>
            <p>Edit your bio</p>
            <input
              className={classes['bioInput']}
              name='bio'
              value={bio}
              onChange={handleChangeBio}
              type="text"
              placeholder='Enter your bio' />
            <input className={classes['bioBtn']} type="submit" value="Change bio" />
            {bioError && <p style={{ color: 'red' }}>{bioError}</p>}
          </form>
        </div>

        <div className={classes['profilePic']}>
          <form onSubmit={handleSubmitProfilePic}>
            <p>Change your profile picture</p>
            <input
              className={classes['profilePicInput']}
              name='profilePic'
              type="file"
              onChange={handleChangeProfilePic} />
            <input className={classes['profilePicBtn']} type="submit" value="Change profile picture" />
            {profilePicError && <p style={{ color: 'red' }}>{profilePicError}</p>}
          </form>
        </div>

        <NavLink
          to={ChangePassRoute}
          className={
            classes['nav-style']
          }
        >
          ChangePassword
        </NavLink>

        <form onSubmit={handleDeleteAcc}>
          <input className={classes['deleteAcc']} type="submit" value="Delete your account" />
        </form>
      </div>
    </span>
  )
}
