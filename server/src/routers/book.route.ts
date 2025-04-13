
import { Router } from 'express';
import { handleLoginUser, handleRegisterUser } from '../controllers/user.controller';
import {
    handleAddBook,
    handleDeleteBook,
    handleExchangeBooks,
    handleGetAllOwnerBooks,
    handleGetAvailableBooks,
    handleGetAvailableBooksByOwner,
    handleGetBookById,
    handleMarkBookAsRented,
    handleUnrentBook,
    handleUpdateBook,
    hanldeGetRentedBooksByUser
} from '../controllers/book.controller';

const router = Router();


router.post('/add', handleAddBook);

router.get('/get-all/available', handleGetAvailableBooks);

router.post('/rent', handleMarkBookAsRented)

router.post('/unrent', handleUnrentBook)

router.get("/get-all/rented", hanldeGetRentedBooksByUser)

router.get('/get-all/owner', handleGetAvailableBooksByOwner);

router.post('/exchange', handleExchangeBooks);

router.get('/get-all', handleGetAllOwnerBooks);

router.delete("/:id", handleDeleteBook);

router.put("/:id", handleUpdateBook);

router.get('/:id', handleGetBookById)

export default router;