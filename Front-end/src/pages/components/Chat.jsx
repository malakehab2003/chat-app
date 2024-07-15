import React from 'react';
import classes from './Chat.module.css';
import Delete from "../../assets/images/delete.png";
import send from "../../assets/images/send.png";

export default function Chat() {
  return (
    <div className={classes.chatContainer}>
      <div className={classes["chatHeader"]}>
        <a className={classes["linkHeader"]} href="">
          <div className={classes["personImage"]}></div>

          <div className={classes["personData"]}>
            <p className={classes["personName"]}>Person name</p>
            <p className={classes["personBio"]}>Click here to see contact&apos;s bio</p>
          </div>
        </a>

        <input className={classes["removeChat"]} type="image" src={Delete} alt="delete" />
      </div>

      <div className={classes["chatBody"]}>
        <div className={classes["receiveContainer"]}>
          <div className={classes["receiveImage"]}></div>
          <div className={classes["receiveMessage"]}>the message send by someone sssssssss sssssssssssssss ssssssssssssssssssss ssssssssssssssssssssss sssssssssssssssssssssss ssssssssssssssssssssssss ssssssssssssssssssssssssss ssssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssss ssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssssssss ssssssssssssssssss</div>
        </div>
        <div className={classes["sendContainer"]}>
          <div className={classes["sendMessage"]}> the message send by me sssssssss sssssssssssssss ssssssssssssssssssss ssssssssssssssssssssss sssssssssssssssssssssss ssssssssssssssssssssssss ssssssssssssssssssssssssss ssssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssss ssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssssssss ssssssssssssssssss sssssssssssssssssssssssssssssss sssssssssssssssssssssssssssssss sssssssssssssssssssssssssssssss</div>
          <div className={classes["sendImage"]}></div>
        </div>
      </div>

      <div className={classes["chatFooter"]}>
        <textarea className={classes["messageInput"]} placeholder="Enter your message"></textarea>
        <input className={classes["sendMessage"]} type="image" src={send} alt="send message" />
      </div>
    </div>
  );
}
