import { useCallback, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import PropTypes from 'prop-types';

import classes from './People.module.css';
import Add from '../../assets/images/add.png';
import Person from './Person';
import {
	AddNewChat,
	GetAllChatsRequest,
} from '../../backend/homePage';
import {
	addChatRoom,
	socket,
	testEmail,
} from '../../constants';

export default function People({
	setChat,
	deletedChatID,
	clearDeletedChatID,
}) {
	const [email, setEmail] = useState('');
	const [addError, setAddError] = useState(null);
	const [chats, setChats] = useState([]);
	const [error, setError] = useState(null);

	const removeDeletedChat = (id) => {
		setChats((chats) => {
			const oldChats = [...chats];
			const deletedChatIndex = oldChats.findIndex(
				(c) => c.id === id
			);
			oldChats.splice(deletedChatIndex, 1);
			return oldChats;
		});
	};
	useEffect(() => {
		GetAllChatsRequest()
			.then((value) => setChats(value))
			.catch((err) => setError(err));
		socket.on('addChat', (chatData) => {
			const newChat = {
				name: chatData.Users.map((user) => user.name)
					.sort()
					.join(', '),
				lastMessage:
					chatData.Messages.length === 0
						? 'No Messages'
						: chatData.Messages[0].latestMessage,
				id: chatData.id,
				type: chatData.roomType,
			};
			setChats((prevChats) => [newChat, ...prevChats]);
		});
		socket.on('deleteChat', (id) => {
			console.log('Deleted on ID: ', id);
			removeDeletedChat(id);
		});
		return () => {
			socket.removeAllListeners('addChat');
			socket.removeAllListeners('deleteChat');
		};
	}, []);

	useEffect(() => {
		if (deletedChatID) {
			removeDeletedChat(deletedChatID);
			clearDeletedChatID();
		}
	}, [deletedChatID]);

	const handleError = (event) => {
		const value = event.target.value;
		setEmail(value);
		if (value !== '' && !testEmail(value)) {
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
				.then(({ formattedChat, chat }) => {
					setChats((chats) => [formattedChat, ...chats]);
					console.log(formattedChat);
					addChatRoom(chat);
				})
				.catch((err) => setAddError(err.message));
		}
	};

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
	clearDeletedChatID: PropTypes.func.isRequired,
	deletedChatID: PropTypes.number,
};
