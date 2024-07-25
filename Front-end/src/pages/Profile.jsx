import { useEffect, useState } from 'react';
import classes from './Profile.module.css';
import NavBar from './components/NavBar';
import { getUser } from '../backend/Profile.jsx';
import defaultImage from '../assets/images/profile-user.png';
import React from 'react';
import { useParams } from 'react-router-dom';

export const ProfileRoute = '/profile/:id';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(defaultImage);
  const { id } = useParams();

  useEffect(() => {
    getUser(id)
      .then((value) => {
        setUser(value);
        if (value || value.image || value.image !== 'user') {
          setUserImage(`../../public/${value.image}`);
        }
      });
  }, [])

  return (
    <span className={classes.root}>
      <div className={classes['navBar']}>
        <NavBar />
      </div>

      {user && <div className={classes['container']}>
        {userImage && <img src={userImage} alt='user image' className={classes['profileImage']} />}
        <div className={classes['profileName']}>{user.name}</div>
        <div className={classes['profileBio']}>{user.bio}</div>
      </div>}
    </span>
  )
}