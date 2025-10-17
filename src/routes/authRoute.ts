import { Router } from 'express';
import { resolveAuthenticateUser } from '../controllers/authenticateUserController';

const router: Router = Router();

router.post('/authenticate-user', resolveAuthenticateUser);

export default router;
