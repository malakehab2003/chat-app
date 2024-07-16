import { useState } from 'react';
import classes from './Login.module.css';
import { SignInRequest } from '../backend/login';
import { useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';

export const LoginRoute = '/login';

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	return (
		<span className={classes.root}>
			<h1>Welcome to chat-app</h1>

			<div className={classes['container']}>
				<div className={classes['signUpContainer']}>
					<p className={classes['new']}>
						Create new account For Free!
					</p>
					<input
						className={classes['SignUp']}
						type='button'
						value='SignUp'
					></input>
				</div>

				<form
					className={classes['signInContainer']}
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
