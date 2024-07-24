import classes from './Settings.module.css';
import { NavLink } from 'react-router-dom';
import { ChangePassRoute } from './ChangePass';
import { useState } from 'react';
import { updateName, deleteAcc } from '../backend/Settings';
import { useNavigate } from 'react-router-dom';
import { LoginRoute } from './Login';

export const SettingsRoute = '/settings';

export default function Settings() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const nav = useNavigate();

  const handleChangeName = (event) => {
    const value = event.target.value;
    setName(value);

    if (value === '') {
      setNameError('Name can\'t be empty');
    }

    setNameError(null)
  }

  const handleSubmitName = (event) => {
    event.preventDefault();
    updateName(name);
  }

  const handleDeleteAcc = (event) => {
    event.preventDefault();
    deleteAcc()
      .then(() => nav(LoginRoute));
  }

  return (
    <span className={classes.root}>
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
