import classes from './Login.module.css'

export const LoginRoute = '/login';

export default function Login() {
	return (
		<span className={classes.root}>
			<h1>Welcome to chat-app</h1>

			<div className={classes["container"]}>

				<div className={classes["signUpContainer"]}>
					<p className={classes["new"]}>Create new account For Free!</p>
					<input className={classes["SignUp"]} type="button" value="SignUp"></input>
				</div>

				<div className={classes["signInContainer"]}>
					<p className={classes["haveAccount"]}>If you have already account</p>

					<div className={classes["email"]}>
						<p>Enter your email</p>
						<input className={classes["inputEmail"]} type="text" placeholder="Email"></input>
					</div>

					<div className={classes["password"]}>
						<p>Enter your Password</p>
						<input className={classes["inputPassword"]} type="text" placeholder="Password"></input>
					</div>

					<input className={classes["Login"]} type="button" value="Login"></input>

				</div>

			</div>
		</span>
	)
}
