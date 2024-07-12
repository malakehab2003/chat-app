import classes from "./Home.module.css"
import NavBar from './components/NavBar'

export default function Home() {
	return (
		<span className={classes.root}>
			<NavBar />
			<div className={[classes.container, classes['home-style']].join(" ")}>

				<div className={[classes.peopleContainer, classes['home-style']].join(" ")}>
					<h1 className={classes['home-style']}>People</h1>

					<div className={[classes.Person, classes['home-style']].join(" ")}>

						<div className={[classes.personImage, classes['home-style']].join(" ")}></div>
						<div className={[classes.personData, classes['home-style']].join(" ")}>
							<p className={[classes.personName, classes['home-style']].join(" ")}>Person name</p>
							<p className={[classes.lastMessage, classes['home-style']].join(" ")}>Last message in the room</p>
						</div>

					</div>

				</div>

				<div className={classes.chatContainer + classes['home-style']}>

				</div>

			</div>
		</span>
	)
}
