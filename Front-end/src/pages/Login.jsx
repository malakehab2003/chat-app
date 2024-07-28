import { useState } from 'react';
import classes from './Login.module.css';
import { SignInRequest } from '../backend/login';
import { useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';
import { SignUpRoute } from './SignUp';
import { NavLink } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { CLIENT_ID } from '../constants';
import { signUpRequest } from '../backend/signUp';

export const LoginRoute = '/login';

export default function Login() {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	const onSignUpSuccess = (res) => {
		const profile = res.getBasicProfile();
		const email = profile.getEmail();
		const pass = profile.getId();
		const name = profile.getName();

		signUpRequest(name, email, pass).then(() =>
			navigate(HomeRoute)
		);
	};

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
			<div className={classes['container']}>
				<div className={classes['signUpContainer']}>
					<p className={classes['new']}>
						Create new account For Free!
					</p>
					<div className={classes['buttons']}>
						<NavLink
							className={classes['SignUp']}
							to={SignUpRoute}
						>
							Sign Up
						</NavLink>
						<GoogleLogin
							className={classes['googleLogin']}
							clientId={CLIENT_ID}
							buttonText='Sign Up With Google'
							onSuccess={onSignUpSuccess}
							onFailure={onFailure}
							cookiePolicy={'single_host_origin'}
							// isSignedIn={true}
						/>
					</div>
				</div>

				<div className={classes['signInContainer']}>
					<form
						className={classes['signInForm']}
						onSubmit={handleLogin}
					>
						<p className={classes['haveAccount']}>
							Already Have an account?
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

						<div className={classes['buttons']}>
							<button
								className={classes['Login']}
								type='submit'
							>
								Login
							</button>
							<GoogleLogin
								className={classes['googleLogin']}
								clientId={CLIENT_ID}
								buttonText='Login with Google instead'
								onSuccess={onSuccess}
								onFailure={onFailure}
								cookiePolicy={'single_host_origin'}
								// isSignedIn={true}
							/>
						</div>
					</form>
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
