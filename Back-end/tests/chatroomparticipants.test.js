import axios from 'axios';
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { StatusCodes } from 'http-status-codes';

import { clearTable, closeConnection, asyncQuery } from "./utils.js";

const users = [
	{
		name: 'test1',
		email: 'test1',
		password: 'password',
	},
	{
		name: 'test2',
		email: 'test2',
		password: 'password',
	},
	{
		name: 'test3',
		email: 'test3',
		password: 'password',
	},
]

before(async function () {
	await clearTable('users');
	const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format current date-time to match SQL format
	for (let index = 0; index < 3; index++) {
		const res = await asyncQuery('INSERT INTO users(name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
			[
				users[index].name,
				users[index].email,
				users[index].password,
				now,
				now,
			]
		);
		users[index].id = res.insertId;
	}
});

beforeEach(async function () {
	await clearTable('chatrooms');
});

const request = axios.create({
	baseURL: 'http://localhost:3000/api/user/chatroom',
});

describe("ChatRoomParticipants Controller", function () {
	this.timeout(5000);
	it("Should Create a new chat room for 2", async function () {
		const { data, status } = await request.post(`?senderId=${users[0].id}`, { receiverId: users[1].id });
		expect(status).to.be.equal(StatusCodes.CREATED);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data.message).to.be.equal('Chat Room Created and Linked');
	});
	it("Should Return Same chat room for 2", async function () {
		const { data: { id } } = await request.post(`?senderId=${users[0].id}`, { receiverId: users[1].id });
		const { data, status } = await request.post(`?senderId=${users[0].id}`, { receiverId: users[1].id });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should Create a new chat room for 3", async function () {
		const { data, status } = await request.post(`/group?senderId=${users[0].id}`, { receiverIds: [users[1].id, users[2].id] });
		expect(status).to.be.equal(StatusCodes.CREATED);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data.message).to.be.equal('Chat Room Created and Linked');
	});
	it("Should Return Same chat room for 3", async function () {
		const { data: { id } } = await request.post(`/group?senderId=${users[0].id}`, { receiverIds: [users[1].id, users[2].id] });
		const { data, status } = await request.post(`/group?senderId=${users[0].id}`, { receiverIds: [users[1].id, users[2].id] });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should Create chat room for 2, even when group is used", async function () {
		const { data: { id } } = await request.post(`?senderId=${users[0].id}`, { receiverId: users[1].id });
		const { data, status } = await request.post(`/group?senderId=${users[0].id}`, { receiverIds: [users[1].id] });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should throw BAD_REQUEST for 2 (senderId)", async function () {
		try {
			await request.post('/');
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('SenderId Not Found');
		}
	});
	it("Should throw BAD_REQUEST for 2 (receiverId)", async function () {
		try {
			await request.post(`?senderId=${users[0].id}`);
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('ReceiverId Not Found');
		}
	});
	it("Should throw NOT_FOUND for 2 (sender)", async function () {
		try {
			await request.post(`?senderId=${users[0].id + 5}`, { receiverId: users[1].id });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Sender Not Found');
		}
	});
	it("Should throw NOT_FOUND for 2 (receiver)", async function () {
		try {
			await request.post(`?senderId=${users[0].id}`, { receiverId: users[1].id + 5 });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Receiver Not Found');
		}
	});
	it("Should throw BAD_REQUEST for 3 (senderId)", async function () {
		try {
			await request.post('/group', { receiverIds: [users[1].id, users[2].id] });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('SenderId Not Found');
		}
	});
	it("Should throw BAD_REQUEST for 3 (receiverIds)", async function () {
		try {
			await request.post(`/group?senderId=${users[0].id}`);
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('ReceiverIds Not Found');
		}
	});
	it("Should throw NOT_FOUND for 3 (senderId)", async function () {
		try {
			await request.post(`/group?senderId=${users[0].id + 5}`, { receiverIds: [users[1].id, users[2].id] });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Sender Not Found');
		}
	});
	it("Should throw NOT_FOUND for 3 (receiverIds)", async function () {
		try {
			await request.post(`/group?senderId=${users[0].id}`, { receiverIds: [users[1].id, users[2].id + 5] });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Receiver Not Found');
		}
	});
});
