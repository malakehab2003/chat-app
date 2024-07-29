import { useEffect, useState } from 'react';
import classes from './Profile.module.css';
import NavBar from './components/NavBar';
import { getUser } from '../backend/Profile.jsx';
import defaultImage from '../assets/images/profile-user.png';
import { useParams } from 'react-router-dom';

export const ProfileRoute = '/profile/:id';

export default function Profile() {
	const [user, setUser] = useState(null);
	const [userImage, setUserImage] = useState(defaultImage);
	const { id } = useParams();

	useEffect(() => {
		getUser(id).then((value) => {
			setUser(value);
			if (value && value.image && value.image !== 'user') {
				setUserImage(`../../${value.image}`);
			}
		});
	}, [id]);

	return (
		<span className={classes.root}>
			<div className={classes['navBar']}>
				<NavBar />
			</div>

			{user && (
				<div className={classes['container']}>
					<div className={classes['data']}>
						<div className={classes['profileName']}>
							Name: {user.name}
						</div>
						<div className={classes['profileBio']}>
							Bio: <p>{user.bio}</p>
						</div>
					</div>
					<div
						className={classes['imagePlaceholder']}
					></div>
					<img
						src={userImage}
						alt='user image'
						className={classes['profileImage']}
					/>
				</div>
			)}
		</span>
	);
}
