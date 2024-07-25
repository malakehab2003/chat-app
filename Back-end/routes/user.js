
import { Router } from 'express';
import * as UserController from '../controllers/UserController.js';
import { AuthRequest } from '../utils/auth.js';
import upload from '../utils/upload.js';

var router = Router();

// crud operations for table user
router.post('/', UserController.createUser);

router.get('/all', UserController.getAllUser);
router.get('/:email', UserController.getUserByEmailFromBody);
// router.get('/:id', UserController.getUser);
router.get('/', AuthRequest, UserController.getUserByToken);

router.put('/:id', AuthRequest, UserController.updateUser);

router.delete('/:id', AuthRequest, UserController.deleteUser);
router.delete('/', AuthRequest, UserController.deleteUserByToken);

// create sign up
router.post('/signUp', UserController.signUp);
router.post('/signIn', UserController.signIn);
router.post('/signOut', UserController.signOut);
router.post('/changePass', AuthRequest, UserController.changePass);
router.post('/changeName', AuthRequest, UserController.changeName);
router.post('/changeBio', AuthRequest, UserController.changeBio);
router.post('/changeImg', AuthRequest, upload.single('profilePic'), UserController.changeImg);

export default router;
