
import { closeConnection, clearTable } from './utils.js';

after(async function () {
	await clearTable('users');
	closeConnection();
});
