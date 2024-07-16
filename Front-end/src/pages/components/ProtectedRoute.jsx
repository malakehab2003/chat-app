import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { getToken } from '../../constants';

const ProtectedRoute = ({ element }) => {
	try {
		getToken();
		return element;
	} catch (error) {
		return <Navigate to='/login' />;
	}
};

ProtectedRoute.propTypes = {
	element: PropTypes.object.isRequired,
};
export default ProtectedRoute;
