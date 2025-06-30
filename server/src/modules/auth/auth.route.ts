// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '@/middlewares/validation.middleware';
import { loginSchema, registerSchema, refreshTokenSchema } from './auth.validation';

const router = Router();

// 🔓 Public auth routes
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/refresh-token', validateBody(refreshTokenSchema), AuthController.refreshToken);

export { router as authRoutes };
