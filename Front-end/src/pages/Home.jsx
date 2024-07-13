import tempClasses from "./Home.module.css"
import NavBar from './components/NavBar'
import Add from "../assets/images/add.png"
import Delete from "../assets/images/delete.png"
import send from "../assets/images/send.png"

const classes = Object.keys(tempClasses).reduce((acc, key) => {
	acc[key] = key === 'root' ? tempClasses[key] : `${tempClasses[key]} ${tempClasses['home-style']}`;
	return acc;
}, {});

export const HomeRoute = '/';

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
							<div className={classes["receiveMessage"]}>the message send by someone sssssssss sssssssssssssss ssssssssssssssssssss ssssssssssssssssssssss sssssssssssssssssssssss ssssssssssssssssssssssss ssssssssssssssssssssssssss ssssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssss ssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssssssss ssssssssssssssssss</div>
						</div>
						<div className={classes["sendContainer"]}>
							<div className={classes["sendMessage"]}> the message send by me sssssssss sssssssssssssss ssssssssssssssssssss ssssssssssssssssssssss sssssssssssssssssssssss ssssssssssssssssssssssss ssssssssssssssssssssssssss ssssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssss ssssssssssssssssssssssss sssssssssssssssssssssssssss sssssssssssssssssssssssssssssss ssssssssssssssssss sssssssssssssssssssssssssssssss sssssssssssssssssssssssssssssss sssssssssssssssssssssssssssssss</div>
							<div className={classes["sendImage"]}></div>
						</div>
					</div>

					<div className={classes["chatFooter"]}>
						<textarea className={classes["messageInput"]} placeholder="Enter your message"></textarea>
						<input className={classes["sendMessage"]} type="image" src={send} alt="send message" />
					</div>
				</div>

			</div>
		</span>
	)
}
