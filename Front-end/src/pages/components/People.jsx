import React from 'react';
import classes from './People.module.css';
import Add from "../../assets/images/add.png";

export default function People() {
  return (
    <div className={classes.peopleContainer}>
      <h1 className={classes['home-style']}>People</h1>

      <div className={classes.newChat}>
        <input className={classes.newChatInput} type="text" placeholder="Add new chat" />
        <input className={classes.newChatButton} type="image" src={Add} alt="Add" />
      </div>
      <a href='' className={classes.Person}>
        <div className={classes.personImage}></div>
        <div className={classes.personData}>
          <p className={classes.personName}>Person name</p>
          <p className={classes.lastMessage}>Last message in the room</p>
        </div>
      </a>
    </div>
  );
}