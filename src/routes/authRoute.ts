import { Router } from 'express';
import { resolveAuthenticateUser } from '../controllers/authenticateUserController';
import { resolveRegisterUser } from '../controllers/registerUserController';

const router: Router = Router();

router.post('/authenticate-user', resolveAuthenticateUser);
router.post('/register-user', resolveRegisterUser);

export default router;
