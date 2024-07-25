import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import userImage from '../../assets/images/profile-user-white.png';
import classes from './Chat.module.css';
import Delete from '../../assets/images/delete.png';
import send from '../../assets/images/send.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { ProfileRoute } from '../Profile'
import {
	GetAllMessages,
	SendNewMessage,
	DeleteChat,
} from '../../backend/chat';
import {
	socket,
	startTyping,
	stopTyping,
} from '../../constants';

export default function Chat({ chat, onDeleteChat }) {
	const [messages, setMessages] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [selectedMember, setSelectedMember] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(chat);
		if (chat && chat.id) {
			GetAllMessages(chat.id).then((res) =>
				setMessages(res)
			);
			socket.on('deleteChat', (id) => {
				if (chat.id === id) {
					onDeleteChat(chat.id);
				}
			});
			socket.on('typing', (id) => {
				console.log(id);
				console.log(`chat: ${chat}`);
				console.log('Receiving Typing', isTyping);
				if (id === chat.id) {
					setIsTyping(true);
				}
			});
			socket.on('stop', (id) => {
				console.log(id, chat.id, isTyping);
				if (id === chat.id) {
					setIsTyping(false);
				}
			});
			socket.on('send', ({ id, message }) => {
				if (id === chat.id) {
					setMessages((messages) => [
						...messages,
						{
							isSent: false,
							content: message,
						},
					]);
				}
			});
			return () => {
				socket.removeAllListeners('typing');
				socket.removeAllListeners('send');
				socket.removeAllListeners('stop');
				socket.removeAllListeners('deleteChat');
			};
		}
	}, [chat]);

	const onTyping = (event) => {
		const text = event.target.value;
		setNewMessage(text);
		if (text === '') {
			stopTyping(chat.id);
		} else {
			startTyping(chat.id);
		}
	};

	const onSend = () => {
		if (newMessage === '') {
			return;
		}
		SendNewMessage(chat.id, newMessage).then(() => {
			setMessages((messages) => [
				...messages,
				{
					content: newMessage,
					isSent: true,
				},
			]);
			setNewMessage('');
			stopTyping(chat.id);
		});
	};

	const handleDeleteChat = async () => {
		if (chat && chat.id) {
			try {
				await DeleteChat(chat.id);
				onDeleteChat(chat.id);
			} catch (err) {
				console.error('Failed to delete chat:', err);
			}
		}
	};

	const handleMemberSelect = (event) => {
    const userId = event.target.value;
    setSelectedMember(userId);
    navigate(`/profile/${userId}`);
    setDropdownVisible(false); // Hide dropdown after selection
  };

	const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

	return (
		<div
			style={
				chat
					? null
					: {
							backgroundColor: 'white',
					  }
			}
			className={classes.chatContainer}
		>
			{chat && (
				<>
					<div className={classes['chatHeader']}>
						{chat.type === 'direct' ? (<NavLink className={classes['linkHeader']} to={`profile/${chat.userId[0]}`}>
							<div>
								<img
									className={classes['personImage']}
									src={userImage}
									alt='user'
								/>
							</div>

							<div className={classes['personData']}>
								<p className={classes['personName']}>
									{chat.name}
								</p>
							</div>
						</NavLink>): (
							<div className={classes['linkHeader']}>
								<div>
								<img
									className={classes['personImage']}
									src={userImage}
									alt='user'
								/>
							</div>
							<span className={classes['groupName']} onClick={toggleDropdown}>
								<div className={classes['personData']}>
									<p className={classes['personName']}>
										{chat.name}
									</p>
								</div>
							</span>
							{isDropdownVisible && (
								<div className={classes['dropdownMenu']}>
									<select onChange={handleMemberSelect} value={selectedMember || ''}>
										<option value="" disabled>Select a member</option>
										{chat.userId.map((userId, index) => (
											<option key={index} value={userId}>{chat.userNames[index]}</option>
										))}
									</select>
								</div>
							)}
						</div>
						)}

						<input
							className={classes['removeChat']}
							type='image'
							src={Delete}
							alt='delete'
							onClick={handleDeleteChat}
						/>
					</div>

					<div className={classes['chatBody']}>
						{messages.map((c, index) =>
							c.isSent ? (
								<div
									className={classes['sendContainer']}
									key={index}
								>
									<div className={classes['sendMessage']}>
										{c.content}
									</div>
									<div>
										<img
											className={classes['sendImage']}
											src={userImage}
											alt='user'
										/>
									</div>
								</div>
							) : (
								<div
									className={classes['receiveContainer']}
									key={index}
								>
									<div>
										<img
											className={classes['receiveImage']}
											src={userImage}
											alt='user'
										/>
									</div>
									{chat.type === 'group' ? (
										<div
											style={{
												display: 'flex',
												flexFlow: 'column',
											}}
										>
											{c.User.name}
											<div
												style={{
													marginTop: '0px',
												}}
												className={
													classes['receiveMessage']
												}
											>
												{c.content}
											</div>
										</div>
									) : (
										<div
											className={classes['receiveMessage']}
										>
											{c.content}
										</div>
									)}
								</div>
							)
						)}
						{isTyping && (
							<ClipLoader
								color='#3498db'
								loading={isTyping}
								size={50}
							/>
						)}
					</div>
					<div className={classes['chatFooter']}>
						<textarea
							className={classes['messageInput']}
							placeholder='Enter your message'
							onChange={onTyping}
							value={newMessage}
						></textarea>
						<input
							className={classes['sendMessage']}
							type='image'
							src={send}
							alt='send message'
							onClick={onSend}
						/>
					</div>
				</>
			)}
		</div>
	);
}

Chat.propTypes = {
	chat: PropTypes.object,
	onDeleteChat: PropTypes.func.isRequired,
};
