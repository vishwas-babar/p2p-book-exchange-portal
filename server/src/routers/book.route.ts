
import { Router } from 'express';
import { handleLoginUser, handleRegisterUser } from '../controllers/user.controller';
import { handleAddBook, handleGetAvailableBooks, handleMarkBookAsRented, handleUnrentBook } from '../controllers/book.controller';

const router = Router();


router.post('/add', handleAddBook);

router.get('/get-all/available', handleGetAvailableBooks);

router.post('/rent', handleMarkBookAsRented)

router.post('/unrent', handleUnrentBook)


export default router;