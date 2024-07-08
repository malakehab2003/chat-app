import express from 'express';
import * as UserController from '../controller/UserController';
import * as MessageController from '../controller/MessageController';

const router = express.Router();

// crud operations for table user
router.post('/api/user', UserController.createUser);
router.get('/api/user/:id', UserController.getUser);
router.get('/api/user', UserController.getUserByEmail);
router.get('/api/users', UserController.getAllUser);
router.put('/api/user/:id', UserController.updateUser);
router.delete('/api/user/:id', UserController.deleteUser);
router.delete('/api/user/', UserController.deleteUserByEmail);

// crud operations for table message
router.post('/api/message', MessageController.createMessage);
router.get('/api/messages', MessageController.getAllMessages);
router.get('/api/message/:id', MessageController.getMessage);
router.get('/api/message', MessageController.getMessageByUserId);
router.put('/api/message/:id', MessageController.updateMessage);
router.delete('/api/message/:id', MessageController.deleteMessage);
router.delete('/api/message', MessageController.deleteMessageByUserId);

export default router;
