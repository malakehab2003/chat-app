import classes from "./NavBar.module.css"

export default function NavBar() {
	return (
		<span className={classes.root}>
			<nav className={[classes.navbar, classes['nav-style']].join(" ")}>
				<div className={[classes["navbar-brand"], classes['nav-style']].join(" ")}>
					<a className={[classes["navbar-brand"], classes['nav-style']].join(" ")} href="">Chat-app</a>
				</div>
				<ul className={[classes["navbar-nav"], classes['nav-style']].join(" ")}>
					<li className={[classes["nav-item"], classes['nav-style']].join(" ")}>
						<a href="" className={[classes["nav-link"], classes['nav-style']].join(" ")}>Home</a></li>
					<li className={[classes["nav-item"], classes['nav-style']].join(" ")}>
						<a href="" className={[classes["nav-link"], classes['nav-style']].join(" ")}>Profile</a></li>
					<li className={[classes["nav-item"], classes['nav-style']].join(" ")}>
						<a href="" className={[classes["nav-link"], classes['nav-style']].join(" ")}>Settings</a></li>
					<li className={[classes["nav-item"], classes['nav-style']].join(" ")}>
						<a href="" className={[classes["nav-link"], classes['nav-style']].join(" ")}>Logout</a></li>
				</ul>
			</nav>
		</span>
	)
}
