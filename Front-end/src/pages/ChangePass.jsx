import classes from './ChangePass.module.css';

export const ChangePassRoute = '/changepass';

export default function ChangePass() {
	return (
		<span className={classes.root}>
			<div className={classes['container']}>
				<h1>Change password</h1>

				<div className={classes['oldPasswordContainer']}>
					<p className={classes['oldPasswordText']}>
						Enter your old password
					</p>
					<input
						className={classes['oldPasswordInput']}
						type='password'
						placeholder='Old Password'
					/>
				</div>

				<div className={classes['newPasswordContainer']}>
					<p className={classes['newPasswordText']}>
						Enter your new password
					</p>
					<input
						className={classes['newPasswordInput']}
						type='password'
						placeholder='New Password'
					/>
					<p className={classes['newPasswordValidate']}>
						New password must contain 8 characters <br /> at
						least one number <br /> and special character
						[@_#$]
					</p>
				</div>

				<div
					className={classes['confirmPasswordContainer']}
				>
					<p className={classes['confirmPasswordText']}>
						Confirm your password
					</p>
					<input
						className={classes['confirmPasswordInput']}
						type='password'
						placeholder='confirm Password'
					/>
				</div>

				<input
					className={classes['Submit']}
					type='button'
					value='Submit'
				/>

				<a className={classes['Cancel']} href=''>
					Cancel
				</a>
			</div>
		</span>
	);
}
