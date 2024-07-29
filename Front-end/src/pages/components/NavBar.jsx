import { useNavigate } from 'react-router-dom';

import { clearData, endConnection } from '../../constants';
import { HomeRoute } from '../Home';
import { LoginRoute } from '../Login';
import classes from './NavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { SettingsRoute } from '../Settings';
import { getUser } from '../../constants';
import { useEffect, useState } from 'react';
import settings from '../../assets/images/settings.png';

export default function NavBar() {
	const navigate = useNavigate();
	const id = getUser().id;

	const [collapseIsShown, setCollapseIsShown] =
		useState(false);

	const [collapseClasses, setCollapseClasses] =
		useState('hide');

	const location = useLocation();

	const isActive = (path) => {
		return (
			(path === '/' && location.pathname === '/') ||
			(path !== '/' && location.pathname.includes(path))
		);
	};

	const toggleDropDown = () => {
		setCollapseClasses('');
		setCollapseIsShown((old) => !old);
	};

	useEffect(() => {
		if (!collapseIsShown) {
			setTimeout(() => setCollapseClasses('hide'), 500);
		} else {
			setTimeout(() => setCollapseClasses('show'), 0);
		}
	}, [collapseIsShown]);

	return (
		<span className={classes.root}>
			<nav
				className={[
					classes.navbar,
					classes['nav-style'],
				].join(' ')}
			>
				<div
					className={[
						classes['navbar-brand'],
						classes['nav-style'],
					].join(' ')}
				>
					<NavLink
						className={[
							classes['navbar-brand'],
							classes['nav-style'],
						].join(' ')}
						to={HomeRoute}
					>
						Chat App
					</NavLink>
				</div>
				<ul
					className={[
						classes['navbar-nav'],
						classes['nav-style'],
					].join(' ')}
				>
					<li
						className={[
							classes['nav-item'],
							classes['nav-style'],
						].join(' ')}
					>
						<NavLink
							to={HomeRoute}
							className={[
								classes['nav-link'],
								classes['nav-style'],
								isActive(HomeRoute)
									? classes['active']
									: '',
							].join(' ')}
						>
							Home
						</NavLink>
					</li>
					<li
						className={[
							classes['nav-item'],
							classes['nav-style'],
						].join(' ')}
					>
						<NavLink
							to={SettingsRoute}
							className={[
								classes['nav-link'],
								classes['nav-style'],
								isActive(SettingsRoute)
									? classes['active']
									: '',
							].join(' ')}
						>
							Settings
						</NavLink>
					</li>
					<li
						className={[
							classes['nav-item'],
							classes['nav-style'],
						].join(' ')}
					>
						<NavLink
							to={`/profile/${id}`}
							className={[
								classes['nav-link'],
								classes['nav-style'],
								isActive('profile')
									? classes['active']
									: '',
							].join(' ')}
						>
							Profile
						</NavLink>
					</li>
					<li
						className={[
							classes['nav-item'],
							classes['nav-style'],
						].join(' ')}
					>
						<NavLink
							onClick={() => {
								clearData();
								endConnection();
								navigate(LoginRoute);
							}}
							className={[
								classes['nav-link'],
								classes['nav-style'],
							].join(' ')}
						>
							Logout
						</NavLink>
					</li>
				</ul>
				<div
					className={classes['collapse']}
					onClick={toggleDropDown}
				>
					<img
						style={{
							objectFit: 'contain',
						}}
						src={settings}
						alt='dropdown menu button'
					/>
				</div>
			</nav>
			<div
				className={`${classes['dropdown-modal']} ${classes[collapseClasses]}`}
			>
				<div
					className={`${classes['dropdown']} ${classes[collapseClasses]}`}
				>
					<ul>
						<li>
							<NavLink to={HomeRoute}>Home</NavLink>
						</li>
						<li>
							<NavLink to={SettingsRoute}>Settings</NavLink>
						</li>
						<li>
							<NavLink to={`/profile/${id}`}>
								Profile
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={() => {
									clearData();
									endConnection();
									navigate(LoginRoute);
								}}
							>
								Logout
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</span>
	);
}
