import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import PropTypes from 'prop-types';

import classes from './People.module.css';
import Add from '../../assets/images/add.png';
import list from '../../assets/images/chatlist.png';
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
				userId: chatData.Users.map((user) => user.id),
				userNames: chatData.Users.map((user) => user.name),
				image:
					chatData.roomType === 'direct'
						? chatData.Users[0].image
						: null,
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
					console.log(chat);
					addChatRoom(chat);
				})
				.catch((err) => setAddError(err.message));
		}
	};

	const [peopleShow, setPeopleShow] = useState('show');
	const [returnChatsShow, setReturnChatsShow] =
		useState('hide');

	const [isPeopleShown, setIsPeopleShown] = useState(true);
	const [windowWidth, setWindowWidth] = useState(
		window.innerWidth
	);

	useEffect(() => {
		if (windowWidth > 540) {
			return;
		}
		if (isPeopleShown) {
			setTimeout(() => {
				setPeopleShow('show');
			}, 0);
			setTimeout(() => {
				setReturnChatsShow('hide');
			}, 500);
		} else {
			setTimeout(() => {
				setPeopleShow('hide');
			}, 500);
			setTimeout(() => {
				setReturnChatsShow('show');
			}, 0);
		}
	}, [isPeopleShown, windowWidth]);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div
				className={`${classes.peopleContainer} ${
					classes[peopleShow] ?? ''
				}`}
			>
				<h1 className={classes['home-style']}>People</h1>

				<div className={classes.newChat}>
					<input
						className={classes.newChatInput}
						type='text'
						placeholder='Enter Email to start chatting'
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
				<div className={classes['chatList']}>
					{chats &&
						chats.map((person, index) => (
							<Person
								person={person}
								key={index}
								onClick={() => {
									if (windowWidth <= 540) {
										setReturnChatsShow('');
										setPeopleShow('');
										setIsPeopleShown(false);
									}
									setChat(person);
								}}
							/>
						))}
				</div>
			</div>
			<div
				className={`${classes['return-chats']} ${
					classes[returnChatsShow] ?? ''
				}`}
				onClick={() => {
					setReturnChatsShow('');
					setPeopleShow('');
					setIsPeopleShown(true);
				}}
			>
				<img
					src={list}
					alt='list of chats'
					style={{
						objectFit: 'contain',
						height: '100%',
					}}
				/>
			</div>
		</>
	);
}

People.propTypes = {
	setChat: PropTypes.func.isRequired,
	clearDeletedChatID: PropTypes.func.isRequired,
	deletedChatID: PropTypes.number,
};
