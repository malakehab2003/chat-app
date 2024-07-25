import { useNavigate } from 'react-router-dom';

import { clearData, endConnection } from '../../constants';
import { HomeRoute } from '../Home';
import { LoginRoute } from '../Login';
import classes from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { SettingsRoute } from '../Settings';
import { ProfileRoute } from '../Profile';

export default function NavBar() {
	const navigate = useNavigate();

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
						Chat-app
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
							to={ProfileRoute}
							className={[
								classes['nav-link'],
								classes['nav-style'],
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
			</nav>
		</span>
	);
}
