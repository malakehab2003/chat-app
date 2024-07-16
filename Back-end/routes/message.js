
import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.js';
import { AuthRequest } from '../utils/auth.js';

var router = Router();

// crud operations for table message
router.post('/', MessageController.createMessage);
router.post('/lastMessage', AuthRequest, MessageController.getLastMessage);

router.get('/all', MessageController.getAllMessages);
router.get('/:id', MessageController.getMessage);
router.get('/', AuthRequest, MessageController.getMessagesByUserId);

router.put('/:id', AuthRequest, MessageController.updateMessage);

router.delete('/:id', AuthRequest, MessageController.deleteMessage);
router.delete('/', AuthRequest, MessageController.deleteMessageByUserId);

export default router;
