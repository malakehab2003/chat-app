import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import classes from './Chat.module.css';
import Delete from '../../assets/images/delete.png';
import send from '../../assets/images/send.png';
import { GetAllMessages } from '../../backend/chat';

export default function Chat({ chat }) {
	useEffect(() => {
		console.log(chat);
		if (chat && chat.id) {
			GetAllMessages(chat.id).then((res) =>
				setMessages(res)
			);
		}
	}, [chat]);

	const [messages, setMessages] = useState([]);

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
							<div className={classes['personImage']}></div>

							<div className={classes['personData']}>
								<p className={classes['personName']}>
									{chat.name}
								</p>
								<p className={classes['personBio']}>
									Click here to see contact&apos;s bio
								</p>
							</div>
						</a>

						<input
							className={classes['removeChat']}
							type='image'
							src={Delete}
							alt='delete'
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
									<div
										className={classes['sendImage']}
									></div>
								</div>
							) : (
								<div
									className={classes['receiveContainer']}
									key={index}
								>
									<div
										className={classes['receiveImage']}
									></div>
									<div
										className={classes['receiveMessage']}
									>
										{c.content}
									</div>
								</div>
							)
						)}
					</div>

					<div className={classes['chatFooter']}>
						<textarea
							className={classes['messageInput']}
							placeholder='Enter your message'
						></textarea>
						<input
							className={classes['sendMessage']}
							type='image'
							src={send}
							alt='send message'
						/>
					</div>
				</>
			)}
		</div>
	);
}

Chat.propTypes = {
	chat: PropTypes.object,
};
