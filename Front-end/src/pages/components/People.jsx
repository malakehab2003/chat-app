import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import PropTypes from 'prop-types';

import classes from './People.module.css';
import Add from '../../assets/images/add.png';
import Person from './Person';
import {
	AddNewChat,
	GetAllChatsRequest,
} from '../../backend/homePage';
import { testEmail } from '../../constants';

export default function People({ setChat }) {
	const [email, setEmail] = useState('');
	const [addError, setAddError] = useState(null);

	useEffect(() => {
		GetAllChatsRequest()
			.then((value) => setChats(value))
			.catch((err) => setError(err));
	}, []);

	const handleError = (event) => {
		const value = event.target.value;
		setEmail(value);
		if (!testEmail(value)) {
			setAddError(
				'Email should be a valid gmail or yahoo email'
			);
		} else {
			setAddError(null);
		}
	};

	const handleAddClick = () => {
		console.log(addError);
		console.log(email);
		if (!addError && email) {
			AddNewChat(email)
				.then((res) => setChats([res, ...chats]))
				.catch((err) => setAddError(err.message));
		}
	};

	const [chats, setChats] = useState(null);
	const [error, setError] = useState(null);

	return (
		<div className={classes.peopleContainer}>
			<h1 className={classes['home-style']}>People</h1>

			<div className={classes.newChat}>
				<input
					className={classes.newChatInput}
					type='text'
					placeholder='Add new chat'
					name='email'
					value={email}
					onChange={handleError}
				/>
				<input
					className={classes.newChatButton}
					type='image'
					src={Add}
					alt='Add'
					onClick={handleAddClick}
				/>
			</div>
			{addError && (
				<p style={{ color: 'red' }}>{addError}</p>
			)}
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
