import { createBrowserRouter } from 'react-router-dom';
import Home, { HomeRoute } from './pages/Home';
import ChangePass, {
	ChangePassRoute,
} from './pages/ChangePass';
import Login, { LoginRoute } from './pages/Login';
import SignUp, { SignUpRoute } from './pages/SignUp';
import ProtectedRoute from './pages/components/ProtectedRoute';

export const router = createBrowserRouter([
	{
		path: HomeRoute,
		element: <ProtectedRoute element={<Home />} />,
	},
	{
		path: SignUpRoute,
		element: <SignUp />,
	},
	{
		path: LoginRoute,
		element: <Login />,
	},
	{
		path: ChangePassRoute,
		element: <ProtectedRoute element={<ChangePass />} />,
	},
]);
