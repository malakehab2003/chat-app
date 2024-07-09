import { Router } from 'express';
import * as ChatRoomParticipants from '../controllers/ChatRoomParticipantsController.js';
import { AuthRequest } from '../utils/auth.js'

var router = Router();

// crud operations for table message
router.post('/group', AuthRequest, ChatRoomParticipants.createChatRoom);
router.post('/', AuthRequest, ChatRoomParticipants.createChatRoomForTwo);

export default router;
