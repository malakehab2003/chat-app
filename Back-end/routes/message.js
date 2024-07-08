
import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.js';

var router = Router();

// crud operations for table message
router.post('/', MessageController.createMessage);

router.get('/all', MessageController.getAllMessages);
router.get('/:id', MessageController.getMessage);
router.get('/', MessageController.getMessageByUserId);

router.put('/:id', MessageController.updateMessage);

router.delete('/:id', MessageController.deleteMessage);
router.delete('/', MessageController.deleteMessageByUserId);

export default router;
