
import { Router } from 'express';
import * as ChatRoom from '../controllers/ChatRoomController.js';

var router = Router();

// crud operations for table message
router.post('/', ChatRoom.createChatRoom);

router.get('/all', ChatRoom.getAllChatRooms);
router.get('/:id', ChatRoom.getChatRoomById);
router.get('/', ChatRoom.getRoomsByUserId);

router.delete('/:id', ChatRoom.deleteRoom);
router.delete('/', ChatRoom.deleteRoomByUserId);

export default router;
