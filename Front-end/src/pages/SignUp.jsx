import classes from './SignUp.module.css';

export const SignUpRoute = '/signup';

export default function SignUp() {
	return (
		<span className={classes.root}>
			<div className={classes['container']}>
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
					/>
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
					/>
					<p className={classes['validatePassword']}>
						Password must contain 8 characters <br /> at
						least one number <br /> and special character
						[@_#$]
					</p>
				</div>
				<input
					className={classes['create']}
					type='button'
					value='Create account'
				/>
			</div>
		</span>
	);
}
