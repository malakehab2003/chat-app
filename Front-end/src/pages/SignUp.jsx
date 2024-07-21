import classes from './SignUp.module.css';
import { useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';
import { useState } from 'react';
import { signUpRequest } from '../backend/signUp';
import { GoogleLogin } from 'react-google-login';

export const SignUpRoute = '/signup';
const CLIENT_ID =
	'361250210633-14h3t6ov1q1llng3mkom9glqis93h9lt.apps.googleusercontent.com';

export default function SignUp() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		pass: '',
	});
	const [emailError, setEmailError] = useState(null);
	const [passError, setPassError] = useState(null);
	const nav = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleEmailError = (event) => {
		const value = event.target.value;
		setFormData((prevFormData) => ({
			...prevFormData,
			email: value,
		}));

		const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;

		if (!regex.test(value)) {
			setEmailError(
				'Email should contain @[gmail | yahoo].com'
			);
		} else {
			setEmailError(null);
		}
	};

	const handlePassError = (event) => {
		const value = event.target.value;
		setFormData((prevFormData) => ({
			...prevFormData,
			pass: value,
		}));

		if (value.length < 8) {
			setPassError('Input must be at least 8 characters');
			return;
		}

		if (!/[0-9]/.test(value)) {
			setPassError(
				'Input must contain at least one number'
			);
			return;
		}

		if (!/[@_#$]/.test(value)) {
			setPassError(
				'Input must contain at least one special character'
			);
			return;
		}

		setPassError(null);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		signUpRequest(
			formData.name,
			formData.email,
			formData.pass
		).then(() => nav(HomeRoute));
	};

	const onSuccess = (res) => {
		const profile = res.getBasicProfile();
		const email = profile.getEmail();
		const pass = profile.getId();
		const name = profile.getName();

		signUpRequest(name, email, pass).then(() =>
			nav(HomeRoute)
		);
	};

	const onFailure = (response) => {
		console.log('Failed:', response);
	};

	return (
		<span className={classes.root}>
			<div className={classes['container']}>
				<form onSubmit={handleSubmit}>
					<h1>Create new Account</h1>
					<p className={classes['createAcc']}>
						Create your account For Free!
					</p>
					<div className={classes['nameContainer']}>
						<p className={classes['nameText']}>
							Enter your name
						</p>
						<input
							className={classes['Name']}
							type='text'
							placeholder='Name'
							name='name'
							value={formData.name}
							onChange={handleChange}
						/>
					</div>
					<div className={classes['emailContainer']}>
						<p className={classes['emailText']}>
							Enter your Email
						</p>
						<input
							className={classes['Email']}
							type='text'
							placeholder='Email'
							name='email'
							value={formData.email}
							onChange={handleEmailError}
						/>
						{emailError && (
							<p style={{ color: 'red' }}>{emailError}</p>
						)}
						<p className={classes['validateEmail']}>
							Email should contain @[gmail | yahoo].com
						</p>
					</div>
					<div className={classes['passwordContainer']}>
						<p className={classes['passwordText']}>
							Enter your password
						</p>
						<input
							className={classes['Password']}
							type='password'
							placeholder='Password'
							name='pass'
							value={formData.pass}
							onChange={handlePassError}
						/>
						{passError && (
							<p style={{ color: 'red' }}>{passError}</p>
						)}
						<p className={classes['validatePassword']}>
							Password must contain 8 characters <br /> at
							least one number <br /> and special character
							[@_#$]
						</p>
					</div>
					<input
						className={classes['create']}
						type='submit'
						value='Create account'
					/>
				</form>
				<div id='gSignInBtn'>
					<GoogleLogin
						clientId={CLIENT_ID}
						buttonText='Sign Up With Google'
						onSuccess={onSuccess}
						onFailure={onFailure}
						cookiePolicy={'single_host_origin'}
						// isSignedIn={true}
					/>
				</div>
			</div>
		</span>
	);
}
