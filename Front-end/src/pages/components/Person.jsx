import classes from './Person.module.css';
import PropTypes from 'prop-types';
import userImage from '../../assets/images/profile-user.png';

export default function Person({
	person: { name, lastMessage, id, image },
	onClick,
}) {
	return (
		<a
			href='#'
			onClick={onClick}
			className={classes.Person}
		>
			<div>
				<img
					className={classes.personImage}
					src={image || userImage}
					alt='user'
				/>
			</div>
			<div className={classes.personData}>
				<p className={classes.personName}>{name}</p>
				<p className={classes.lastMessage}>{lastMessage}</p>
			</div>
		</a>
	);
}

Person.propTypes = {
	person: PropTypes.shape({
		name: PropTypes.string.isRequired,
		lastMessage: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		image: PropTypes.string,
	}).isRequired,
	onClick: PropTypes.func.isRequired,
};
