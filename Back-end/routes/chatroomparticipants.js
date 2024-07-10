import { Router } from 'express';
import * as ChatRoomParticipants from '../controllers/ChatRoomParticipantsController.js';
import ChatRoomMessagesRoutes from "./chatroommessages.js";
import { AuthRequest } from '../utils/auth.js'

var router = Router();

// crud operations for table message
router.post('/group', AuthRequest, ChatRoomParticipants.createChatRoom);
router.use('/:id', AuthRequest, ChatRoomMessagesRoutes);
router.post('/', AuthRequest, ChatRoomParticipants.createChatRoomForTwo);


export default router;
