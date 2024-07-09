export const CUSTOM_ERRORS = {
	HEADER_NOT_FOUND: 404,
	INVALID_TOKEN: 405,
	USER_NOT_FOUND: 406,
	INCORRECT_PASSWORD: 407,
}

class CustomError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code
	}
}

export class HeaderNotFoundError extends CustomError {
	constructor() {
		super(CUSTOM_ERRORS.HEADER_NOT_FOUND, "Header not found");
	}
}

export class InvalidTokenError extends CustomError {
	constructor() {
		super(CUSTOM_ERRORS.INVALID_TOKEN, "Invalid Token");
	}
}

export class UserNotFoundError extends CustomError {
	constructor() {
		super(CUSTOM_ERRORS.USER_NOT_FOUND, "User not Found");
	}
}

export class IncorrectPasswordError extends CustomError {
	constructor() {
		super(CUSTOM_ERRORS.INCORRECT_PASSWORD, "Incorrect Password");
	}
}
