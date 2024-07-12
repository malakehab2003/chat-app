import tempClasses from "./Home.module.css"
import NavBar from './components/NavBar'
import Add from "../assets/images/add.png"
import Delete from "../assets/images/delete.png"

const classes = Object.keys(tempClasses).reduce((acc, key) => {
	acc[key] = key === 'root' ? tempClasses[key] : `${tempClasses[key]} ${tempClasses['home-style']}`;
	return acc;
}, {});

export default function Home() {
	return (
		<span className={classes.root}>
			<NavBar />
			<div className={classes.container}>

				<div className={classes.peopleContainer}>
					<h1 className={tempClasses['home-style']}>People</h1>

					<div className={classes["newChat"]}>
						<input className={classes["newChatInput"]} type="text" placeholder="Add new chat" />
						<input className={classes["newChatButton"]} type="image" src={Add} alt="Add" />
					</div>
					<a href='' className={classes.Person}>
						<div className={classes.personImage}></div>
						<div className={classes.personData}>
							<p className={classes.personName}>Person name</p>
							<p className={classes.lastMessage}>Last message in the room</p>
						</div>

					</a>

				</div>

				<div className={classes.chatContainer}>
					<div className={classes["chatHeader"]}>
						<a className={classes["linkHeader"]} href="">
							<div className={classes["personImage"]}></div>

							<div className={classes["personData"]}>
								<p className={classes["personName"]}>Person name</p>
								<p className={classes["personBio"]}>Click here to see contact&apos;s bio</p>
							</div>
						</a>

						<input className={classes["removeChat"]} type="image" src={Delete} alt="delete" />
					</div>

					<div className={classes["chatBody"]}>
						<div className={classes["receiveContainer"]}>
							<div className={classes["receiveImage"]}></div>
							<div className={classes["receiveMessage"]}><p>the message send by someone</p></div>
						</div>
						<div className={classes["sendContainer"]}>
							<div className={classes["sendMessage"]}> the message send by me</div>
							<div className={classes["sendImage"]}></div>
						</div>
					</div>

					<div className={classes["chatFooter"]}>
					</div>
				</div>

			</div>
		</span>
	)
}
