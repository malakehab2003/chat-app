import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import PropTypes from 'prop-types';

import classes from './People.module.css';
import Add from '../../assets/images/add.png';
import Person from './Person';
import { GetAllChatsRequest } from '../../backend/homePage';

export default function People({ setChat }) {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [personName, setPersonName] = useState([]);
	let lastMessage = '';
	const [triggerFetch, setTriggerFetch] = useState(false);

	const handleError = (event) => {
		const value = event.target.value;
		setEmail(value);

		const regex =
			/^([a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)(,\s[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)*$/;

		if (!regex.test(value)) {
			setError('Email should contain @[gmail | yahoo].com');
		} else {
			setError(null);
		}
	};

	const handleAddClick = () => {
		if (!error && email) {
			setTriggerFetch(true);
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				if (email.includes(', ')) {
					const emails = email.split(', ');
					const ids = [];
					for (const e of emails) {
						const res = await instance.get(`${e}`);
						const { user } = res.data;
						ids.push(user.id);
					}
					setPersonName((prevNames) => [
						...prevNames,
						'Group',
					]);

					const respond = await rooms.post(
						'group',
						{
							receiverIds: ids,
						},
						{
							headers: {
								Authorization: token,
							},
						}
					);

					// chat room id
					const { id } = respond.data;
				} else {
					const res = await instance.get(`${email}`);
					const { user } = res.data;
					setPersonName((prevNames) => [
						...prevNames,
						user.name,
					]);

					const respond = await rooms.post(
						'',
						{
							receiverId: user.id,
						},
						{
							headers: {
								Authorization: token,
							},
						}
					);
				}

				// chat room id
				const { id } = respond.data;

				const getMessage = await messages.post(
					'lastMessage',
					{
						roomId: id,
					},
					{
						headers: {
							Authorization: token,
						},
					}
				);

				const { message } = getMessage.data;

				lastMessage = message.content;
			} catch (error) {
				console.error('Error fetching user data:', error);
			} finally {
				setTriggerFetch(false);
			}
		};

		if (triggerFetch) {
			fetchUserData();
		}
	}, [triggerFetch, email]);

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
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{personName.map((name) => (
				<a href='' className={classes.Person}>
					<img
						className={classes.personImage}
						src={userImage}
						alt='userImage'
					/>
					<div className={classes.personData}>
						<p className={classes.personName}>{name}</p>
						<p className={classes.lastMessage}>
							{lastMessage}
						</p>
					</div>
				</a>
			))}
		</div>
	);
}

People.propTypes = {
	setChat: PropTypes.func.isRequired,
};
