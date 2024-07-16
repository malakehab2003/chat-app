import { useEffect, useState } from 'react';

import tempClasses from './Home.module.css';
import NavBar from './components/NavBar';
import Chat from './components/Chat';
import People from './components/People';
import { getId, startConnection } from '../constants';

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

export default function Home() {
	const [chat, setChat] = useState(null);

	useEffect(() => {
		startConnection(getId());
	}, []);

	return (
		<span className={classes.root}>
			<NavBar />
			<div className={classes.container}>
				<People setChat={setChat} />
				<Chat chat={chat} />
			</div>
		</span>
	);
}
