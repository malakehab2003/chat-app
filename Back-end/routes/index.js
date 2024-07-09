import { Router } from 'express';
import UserRoutes from "./user.js";
import MessageRoutes from "./message.js";
import ChatRoomRoutes from "./chatroom.js";
import ChatRoomParticipantsRoutes from "./chatroomparticipants.js";
import ChatRoomMessagesRoutes from "./chatroommessages.js";

var router = Router();


router.use('/user', UserRoutes);
router.use('/message', MessageRoutes);
router.use('/chatroom', ChatRoomRoutes);
router.use('/user/chatroom/:id', ChatRoomMessagesRoutes);
router.use('/user/chatroom', ChatRoomParticipantsRoutes);

export default router;
