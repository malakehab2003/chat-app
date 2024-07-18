import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners'; // Import the spinner
import userImage from '../../assets/images/profile-user-white.png';
import classes from './Chat.module.css';
import Delete from '../../assets/images/delete.png';
import send from '../../assets/images/send.png';
import {
	GetAllMessages,
	SendNewMessage,
	DeleteChat
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

	useEffect(() => {
		console.log(chat);
		if (chat && chat.id) {
			GetAllMessages(chat.id).then((res) =>
				setMessages(res)
			);
			socket.on('typing', (id) => {
				console.log(id);
				console.log(`chat: ${chat}`);
				console.log('Receiving Typing');
				if (id === chat.id && !isTyping) {
					setIsTyping(true);
				}
			});
			socket.on('stop', (id) => {
				if (id === chat.id && isTyping) {
					setIsTyping(false);
				}
			});
			socket.on('send', ({ id, message }) => {
				if (id === chat.id) {
					setMessages([
						...messages,
						{
							isSent: false,
							content: message,
						},
					]);
				}
			});
		}
	}, [chat, isTyping]);

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
			setMessages([
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
	}

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
						<a className={classes['linkHeader']} href=''>
							<div>
								<img className={classes['personImage']} src={userImage} alt="user" />
							</div>

							<div className={classes['personData']}>
								<p className={classes['personName']}>
									{chat.name}
								</p>
							</div>
						</a>

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
										<img className={classes['sendImage']} src={userImage} alt="user" />
									</div>
								</div>
							) : (
								<div
									className={classes['receiveContainer']}
									key={index}
								>
									<div>
										<img className={classes['receiveImage']} src={userImage} alt="user" />
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
