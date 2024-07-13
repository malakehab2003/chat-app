import {
	createBrowserRouter
} from "react-router-dom";
import Home, { HomeRoute } from './pages/Home';
import ChangePass, { ChangePassRoute } from './pages/ChangePass';
import Login, { LoginRoute } from './pages/Login';
import SignUp, { SignUpRoute } from './pages/SignUp';

export const router = createBrowserRouter([
	{
		path: HomeRoute,
		element: <Home />,
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
		element: <ChangePass />,
	},
]);
