import classes from './SignUp.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';
import { useState } from 'react';
import { signUpRequest } from '../backend/signUp';
import { LoginRoute } from './Login';

export const SignUpRoute = '/signup';

export default function SignUp() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		pass: '',
	});
	const [emailError, setEmailError] = useState(null);
	const [nameError, setNameError] = useState(null);
	const [passError, setPassError] = useState([]);
	const nav = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));

		setNameError(null);

		if (value === '') {
			setNameError('This Field is required');
		}
	};

	const handleEmailError = (event) => {
		const value = event.target.value;
		setFormData((prevFormData) => ({
			...prevFormData,
			email: value,
		}));

		if (value === '') {
			setEmailError('This Field is required');
			return;
		}

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

		setPassError([]);

		if (value === '') {
			setPassError(['This Field is required']);
			return;
		}

		const errors = [];

		if (value.length < 8) {
			errors.push('Input must be at least 8 characters');
		}

		if (!/[0-9]/.test(value)) {
			errors.push('Input must contain at least one number');
		}

		if (!/[@_#$]/.test(value)) {
			errors.push(
				'Input must contain at least one special character'
			);
		}

		setPassError(errors);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		signUpRequest(
			formData.name,
			formData.email,
			formData.pass
		).then(() => nav(HomeRoute));
	};

	return (
		<span className={classes.root}>
			<div className={classes['container']}>
				<form
					style={{
						display: 'flex',
						flexFlow: 'column',
						alignItems: 'center',
					}}
					onSubmit={handleSubmit}
				>
					<h1>Create new Account</h1>
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
						{nameError && (
							<p style={{ color: 'red' }}>{nameError}</p>
						)}
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
						{passError.length > 0 && (
							<p style={{ color: 'red' }}>
								{passError.map((error, index) => (
									<div key={index}>{error}</div>
								))}
							</p>
						)}
					</div>
					<input
						className={classes['create']}
						type='submit'
						value='Create account'
					/>
					<NavLink to={LoginRoute}>Sign in instead</NavLink>
				</form>
			</div>
		</span>
	);
}
