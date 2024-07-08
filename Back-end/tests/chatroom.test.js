import axios from 'axios';
import { expect } from 'chai';
import { config } from 'dotenv';
import { beforeEach } from 'mocha';
import { createConnection } from 'mysql2';
import { promisify } from 'util';

config();

let connection;
let asyncQuery;

before(async function () {
	connection = createConnection(
		{
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		}
	);
	asyncQuery = promisify(connection.query).bind(connection);
});

beforeEach(async function () {
	await asyncQuery('DELETE FROM chatrooms;');
});

after(async function () {
	connection.end((err) => {
		if (err) throw err;
	});
})

axios.defaults.baseURL = 'http://localhost:3000/api/chatroom';

describe("ChatRoom Controller", () => {
	it('Should Create a new ChatRoom', async function () {
		const id = await getLastChatId();
		const { data, status } = await axios.post('/');
		expect(status).to.be.equal(201);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data.id).to.be.equal(id + 1);
	});
	it('Should get all Chatrooms', async function () {
		await axios.post('/');
		const { data, status } = await axios.get('/all');
		expect(status).to.be.equal(200);
		expect(data).to.not.be.null;
		expect(Array.isArray(data)).to.be.true;
		expect(data.length).to.be.equal(1);
		expect(data[0]).to.have.property('id');
		expect(data[0]).to.have.property('createdAt');
		expect(data[0]).to.have.property('updatedAt');
	});
	it('Should get a ChatRoom', async function () {
		const createRes = await axios.post('/');
		const { id } = createRes.data;
		const { data, status } = await axios.get(`/${id}`);
		expect(status).to.be.equal(200);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data).to.have.property('createdAt');
		expect(data).to.have.property('updatedAt');
		expect(data.id).to.be.equal(id);
	});
	it('Should delete a ChatRoom', async function () {
		const createRes = await axios.post('/');
		const { id } = createRes.data;
		const { data, status } = await axios.delete(`/${id}`);
		expect(status).to.be.equal(201);
		expect(data).to.not.be.null;
		expect(data).to.be.equal('room deleted');
	});
	it('Should return a 404 response on get and delete', async function () {
		const id = await getLastChatId();
		try {
			await axios.get(`/${id + 1}`);
			throw new Error('Request did not fail as expected');
		} catch (err) {
			const { response: { data, status } } = err;
			expect(status).to.be.equal(404);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('can\'t get chat room');
		}
		try {
			await axios.delete(`/${id + 1}`);
			throw new Error('Request did not fail as expected');
		} catch (err) {
			const { response: { data, status } } = err;
			expect(status).to.be.equal(404);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('can\'t get chat room');
		}
	});
});
const getLastChatId = async function () {
	const allChats = await axios.post('/');
	const { data } = allChats;
	return data.id
}
