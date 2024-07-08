import { Router } from 'express';
import UserRoutes from "./user.js";
import MessageRoutes from "./message.js";

var router = Router();


router.use('/user', UserRoutes);
router.use('/message', MessageRoutes);

export default router;
