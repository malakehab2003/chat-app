import classes from './ChangePass.module.css';
import { useState } from 'react';
import { changePassRequest } from '../backend/changePass';
import { useNavigate } from 'react-router-dom';
import { HomeRoute } from './Home';
import { NavLink } from 'react-router-dom';

export const ChangePassRoute = '/changepass';

export default function ChangePass() {
	const [formData, setFormData] = useState({
		oldPass: '',
		newPass: '',
		confirmPass: '',
	});
	const [newPassError, setNewPassError] = useState([]);
	const [confirmPassError, setConfirmPassError] =
		useState(null);
	const [oldPassError, setOldPassError] = useState(null);
	const nav = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleNewPassChange = (event) => {
		const value = event.target.value;
		setFormData((prevFormData) => ({
			...prevFormData,
			newPass: value,
		}));

		setNewPassError([]);

		if (value === '') {
			setNewPassError(['This Field is required']);
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

		setNewPassError(errors);
	};

	const handleConfirmPass = (event) => {
		const value = event.target.value;
		setFormData((prevFormData) => ({
			...prevFormData,
			confirmPass: value,
		}));

		if (formData.newPass !== value) {
			setConfirmPassError(
				'Confirm password must equal to new password'
			);
			return;
		}

		setConfirmPassError(null);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		changePassRequest(formData.oldPass, formData.newPass)
			.then(() => nav(HomeRoute))
			.catch((err) => {
				if (err.response.status === 400) {
					setOldPassError('Incorrect Old Password');
				} else {
					console.log(err.response.data);
				}
			});
	};

	return (
		<span className={classes.root}>
			<div className={classes.container}>
				<h1>Change password</h1>
				<form onSubmit={handleSubmit}>
					<div className={classes.oldPasswordContainer}>
						<p className={classes.oldPasswordText}>
							Enter your old password
						</p>
						<input
							className={classes.oldPasswordInput}
							type='password'
							placeholder='Old Password'
							name='oldPass'
							value={formData.oldPass}
							onChange={handleChange}
						/>
						{oldPassError && (
							<div style={{ color: 'red' }}>
								{oldPassError}
							</div>
						)}
					</div>

					<div className={classes.newPasswordContainer}>
						<p className={classes.newPasswordText}>
							Enter your new password
						</p>
						<input
							className={classes.newPasswordInput}
							type='password'
							placeholder='New Password'
							name='newPass'
							value={formData.newPass}
							onChange={handleNewPassChange}
						/>
						{newPassError.length > 0 && (
							<p style={{ color: 'red' }}>
								{newPassError.map((error, index) => (
									<div key={index}>{error}</div>
								))}
							</p>
						)}
					</div>

					<div className={classes.confirmPasswordContainer}>
						<p className={classes.confirmPasswordText}>
							Confirm your password
						</p>
						<input
							className={classes.confirmPasswordInput}
							type='password'
							placeholder='Confirm Password'
							name='confirmPass'
							value={formData.confirmPass}
							onChange={handleConfirmPass}
						/>
						{confirmPassError && (
							<div style={{ color: 'red' }}>
								{confirmPassError}
							</div>
						)}
					</div>

					<div
						style={{
							display: 'flex',
							gap: '10px',
							paddingTop: '10px',
						}}
					>
						<input
							className={classes.Submit}
							type='submit'
							value='Submit'
						/>
						<NavLink
							className={classes.Cancel}
							to={HomeRoute}
						>
							Cancel
						</NavLink>
					</div>
				</form>
			</div>
		</span>
	);
}
