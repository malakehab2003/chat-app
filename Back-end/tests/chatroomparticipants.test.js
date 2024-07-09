import axios from 'axios';
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { StatusCodes } from 'http-status-codes';

import { clearTable, asyncQuery } from "./utils.js";

const users = [
	{
		name: 'test1',
		email: 'test1@gmail.com',
		password: 'P@ssw0rd2024',
	},
	{
		name: 'test2',
		email: 'test2@gmail.com',
		password: 'P@ssw0rd2024',
	},
	{
		name: 'test3',
		email: 'test3@gmail.com',
		password: 'P@ssw0rd2024',
	},
]


const userRequest = axios.create({
	baseURL: 'http://localhost:3000/api/user',
});

let request;

before(async function () {
	for (let index = 0; index < 3; index++) {
		const { data: { token } } = await userRequest.post('/signUp', users[index]);
		const { data: { id } } = await userRequest.get('/', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		users[index].token = token;
		users[index].id = id;
	}
	request = axios.create({
		baseURL: 'http://localhost:3000/api/user/chatroom',
		headers: {
			Authorization: `Bearer ${users[0].token}`
		}
	});
});

beforeEach(async function () {
	await clearTable('chatrooms');
});

describe("ChatRoomParticipants Controller", function () {
	this.timeout(5000);
	it("Should Create a new chat room for 2", async function () {
		const { data, status } = await request.post(`/`, { receiverId: users[1].id });
		expect(status).to.be.equal(StatusCodes.CREATED);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data.message).to.be.equal('Chat Room Created and Linked');
	});
	it("Should Return Same chat room for 2", async function () {
		const { data: { id } } = await request.post(`/`, { receiverId: users[1].id });
		const { data, status } = await request.post(`/`, { receiverId: users[1].id });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should Create a new chat room for 3", async function () {
		const { data, status } = await request.post(`/group`, { receiverIds: [users[1].id, users[2].id] });
		expect(status).to.be.equal(StatusCodes.CREATED);
		expect(data).to.not.be.null;
		expect(data).to.have.property('id');
		expect(data.message).to.be.equal('Chat Room Created and Linked');
	});
	it("Should Return Same chat room for 3", async function () {
		const { data: { id } } = await request.post(`/group`, { receiverIds: [users[1].id, users[2].id] });
		const { data, status } = await request.post(`/group`, { receiverIds: [users[1].id, users[2].id] });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should Create chat room for 2, even when group is used", async function () {
		const { data: { id } } = await request.post(``, { receiverId: users[1].id });
		const { data, status } = await request.post(`/group`, { receiverIds: [users[1].id] });
		expect(status).to.be.equal(StatusCodes.OK);
		expect(data).to.not.be.null;
		expect(data.message).to.be.equal('Chat Room already Exists');
		expect(data.id).to.be.equal(id);
	});
	it("Should throw BAD_REQUEST for 2 (receiverId)", async function () {
		try {
			await request.post(`/`);
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('ReceiverId Not Found');
		}
	});
	it("Should throw NOT_FOUND for 2 (receiver)", async function () {
		try {
			await request.post(`/`, { receiverId: users[1].id + 5 });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Receiver Not Found');
		}
	});
	it("Should throw BAD_REQUEST for 3 (receiverIds)", async function () {
		try {
			await request.post(`/group`);
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.BAD_REQUEST);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('ReceiverIds Not Found');
		}
	});
	it("Should throw NOT_FOUND for 3 (receiverIds)", async function () {
		try {
			await request.post(`/group`, { receiverIds: [users[1].id, users[2].id + 5] });
			throw new Error("Should Have Failed")
		} catch ({ response: { data, status } }) {
			expect(status).to.be.equal(StatusCodes.NOT_FOUND);
			expect(data).to.not.be.null;
			expect(data).to.be.equal('Receiver Not Found');
		}
	});
});
