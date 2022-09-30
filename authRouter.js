import Router from 'express';
import AuthController from './authController.js';
import { check } from 'express-validator';
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';

const router = new Router();

router.post('/registration', [
    check('username', "Name cannot be empty").notEmpty(),
    check('password', "Password cannot be less than 4 and bigger than 10").isLength({ min: 4, max: 10 })
],AuthController.registration);
router.post('/login', AuthController.login);
router.get('/users', roleMiddleware(["USER", "ADMIN"]), AuthController.getUsers);

export default router;