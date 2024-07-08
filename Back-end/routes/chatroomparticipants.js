import { Router } from 'express';
import * as ChatRoomParticipants from '../controllers/ChatRoomParticipantsController.js';

var router = Router();

// crud operations for table message
router.post('/group', ChatRoomParticipants.createChatRoom);
router.post('/', ChatRoomParticipants.createChatRoomForTwo);

export default router;
