
import e, { Router } from 'express';
import { handleLoginUser, handleRegisterUser } from '../controllers/user.controller';

const router = Router();


router.post('/register', handleRegisterUser);

router.post('/login', handleLoginUser);


export default router;