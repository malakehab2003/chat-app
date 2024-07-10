
import { Router } from 'express';
import * as MessageController from '../controllers/MessageController.js';
import { AuthRequest } from '../utils/auth.js';

var router = Router({ mergeParams: true });

router.post('/', MessageController.sendToRoom);
router.get('/', MessageController.getRoomMessages);

export default router;
