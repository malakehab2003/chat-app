import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import PropTypes from 'prop-types';

import classes from './People.module.css';
import Add from '../../assets/images/add.png';
import Person from './Person';
import { GetAllChatsRequest } from '../../backend/homePage';

export default function People({ setChat }) {
	useEffect(() => {
		GetAllChatsRequest()
			.then((value) => setChats(value))
			.catch((err) => setErrors(err));
	}, []);

	const [chats, setChats] = useState(null);
	const [error, setErrors] = useState(null);

	return (
		<div className={classes.peopleContainer}>
			<h1 className={classes['home-style']}>People</h1>

			<div className={classes.newChat}>
				<input
					className={classes.newChatInput}
					type='text'
					placeholder='Add new chat'
				/>
				<input
					className={classes.newChatButton}
					type='image'
					src={Add}
					alt='Add'
				/>
			</div>
			{/* <div className={classes.personImage}></div>
				<div className={classes.personData}>
					<p className={classes.personName}>Person name</p>
					<p className={classes.lastMessage}>
						Last message in the room
					</p>
				</div> */}
			{!chats && !error && (
				<ClipLoader
					color='#3498db'
					loading={!chats && !error}
					size={50}
				/>
			)}
			{chats &&
				chats.map((person, index) => (
					<Person
						person={person}
						key={index}
						onClick={() => setChat(person)}
					/>
				))}
		</div>
	);
}

People.propTypes = {
	setChat: PropTypes.func.isRequired,
};
