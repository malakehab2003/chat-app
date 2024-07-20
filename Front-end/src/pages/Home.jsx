import { useEffect, useState } from 'react';

import tempClasses from './Home.module.css';
import NavBar from './components/NavBar';
import Chat from './components/Chat';
import People from './components/People';
import { getId, startConnection } from '../constants';
import { gapi } from 'gapi-script';

const classes = Object.keys(tempClasses).reduce(
	(acc, key) => {
		acc[key] =
			key === 'root'
				? tempClasses[key]
				: `${tempClasses[key]} ${tempClasses['home-style']}`;
		return acc;
	},
	{}
);

export const HomeRoute = '/';
const CLIENT_ID = '361250210633-14h3t6ov1q1llng3mkom9glqis93h9lt.apps.googleusercontent.com';

export default function Home() {
	const [chat, setChat] = useState(null);
	const [deletedChatId, setDeletedChatId] = useState(null);

	useEffect(() => {
		startConnection(getId());
		const start = () => {
			gapi.client.init({
				clientId: CLIENT_ID,
				scope: '',
			})
		}

		gapi.load('client: auth2', start);
	}, []);

	const handleDeleteChat = (chatId) => {
		setChat(null);
		setDeletedChatId(chatId);
	};

	return (
		<span className={classes.root}>
			<NavBar />
			<div className={classes.container}>
				<People
					setChat={setChat}
					deletedChatID={deletedChatId}
					clearDeletedChatID={() => setDeletedChatId(null)}
				/>
				<Chat chat={chat} onDeleteChat={handleDeleteChat} />
			</div>
		</span>
	);
}
