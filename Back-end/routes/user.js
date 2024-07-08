
import { Router } from 'express';
import * as UserController from '../controllers/UserController.js';

var router = Router();

// crud operations for table user
router.post('/', UserController.createUser);

router.get('/all', UserController.getAllUser);
router.get('/:id', UserController.getUser);
router.get('/', UserController.getUserByEmail);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.deleteUser);
router.delete('/', UserController.deleteUserByEmail);

// create sign up
router.post('/signUp', UserController.signUp);
router.post('/signIn', UserController.signIn);
router.post('/signOut', UserController.signOut);

export default router;
