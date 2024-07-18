
import { Router } from 'express';
import * as ChatRoom from '../controllers/ChatRoomController.js';
import { AuthRequest } from "../utils/auth.js";

var router = Router();

// crud operations for table message
// router.post('/', ChatRoom.createChatRoom);

// router.get('/all', ChatRoom.getAllChatRooms);
// router.get('/:id', ChatRoom.getChatRoomById);
router.get('/', AuthRequest, ChatRoom.getRoomsByUserId);

router.delete('/:id', AuthRequest, ChatRoom.deleteRoom);
router.delete('/', AuthRequest, ChatRoom.deleteRoomsByUserId);

export default router;
