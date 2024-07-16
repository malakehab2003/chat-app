import classes from './Person.module.css';
import PropTypes from 'prop-types';

export default function Person({
	person: { name, lastMessage, id },
	onClick,
}) {
	return (
		<a
			href='#'
			onClick={onClick}
			className={classes.Person}
		>
			<div className={classes.personImage}></div>
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
	}).isRequired,
	onClick: PropTypes.func.isRequired,
};
