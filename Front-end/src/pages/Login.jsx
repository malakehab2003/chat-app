import { useState } from 'react';
import classes from './Login.module.css';
import { SignInRequest } from '../backend/login';
import { useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';
import { SignUpRoute } from './SignUp';
import { NavLink } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

export const LoginRoute = '/login';
const CLIENT_ID =
	'361250210633-14h3t6ov1q1llng3mkom9glqis93h9lt.apps.googleusercontent.com';

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	const onSuccess = (res) => {
		const profile = res.getBasicProfile();
		const email = profile.getEmail();
		const pass = profile.getId();

		SignInRequest(email, pass)
			.then(() => navigate(HomeRoute))
			.catch((err) => setError(err.response.data));
	};

	const onFailure = (response) => {
		console.log('Failed:', response);
	};

	return (
		<span className={classes.root}>
			<h1>Welcome to chat-app</h1>

			<div className={classes['container']}>
				<div className={classes['signUpContainer']}>
					<p className={classes['new']}>
						Create new account For Free!
					</p>
					<NavLink
						className={classes['SignUp']}
						to={SignUpRoute}
					>
						SignUp
					</NavLink>
				</div>

				<div className={classes['signInContainer']}>
					<form
						className={classes['signInForm']}
						onSubmit={handleLogin}
					>
						<p className={classes['haveAccount']}>
							If you have already account
						</p>

						<div className={classes['email']}>
							<p>Enter your email</p>
							<input
								className={classes['inputEmail']}
								onChange={(e) => setEmail(e.target.value)}
								type='text'
								placeholder='Email'
							></input>
						</div>

						<div className={classes['password']}>
							<p>Enter your Password</p>
							<input
								className={classes['inputPassword']}
								onChange={(e) => setPass(e.target.value)}
								type='password'
								placeholder='Password'
							></input>
						</div>
						{error && <div>{error}</div>}

						<button
							className={classes['Login']}
							type='submit'
						>
							Login
						</button>
					</form>
					<div id='gSignInBtn'>
						<GoogleLogin
							clientId={CLIENT_ID}
							buttonText='Login'
							onSuccess={onSuccess}
							onFailure={onFailure}
							cookiePolicy={'single_host_origin'}
							// isSignedIn={true}
						/>
					</div>
				</div>
			</div>
		</span>
	);

	function handleLogin(event) {
		event.preventDefault();
		if (email === '') {
			return setError("Email can't be Empty");
		}
		if (pass === '') {
			return setError("Password can't be Empty");
		}
		SignInRequest(email, pass)
			.then(() => navigate(HomeRoute))
			.catch((err) => setError(err.response.data));
	}
}
