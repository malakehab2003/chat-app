import { Router } from 'express';
import UserRoutes from "./user.js";
import MessageRoutes from "./message.js";
import ChatRoomRoutes from "./chatroom.js";

var router = Router();


router.use('/user', UserRoutes);
router.use('/message', MessageRoutes);
router.use('/chatroom', ChatRoomRoutes);

export default router;
