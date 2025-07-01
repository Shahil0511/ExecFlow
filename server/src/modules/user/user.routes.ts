// src/modules/user/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../middlewares/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userParamsSchema,
  userQuerySchema,
} from './user.validation';

const router = Router();

// Public route (initial admin creation)
router.post('/', validateBody(createUserSchema), UserController.createUser);

// All routes below require authentication
router.use(authenticate);

// Current user routes
router.get('/me', UserController.getCurrentUser);
router.patch(
  '/me/change-password',
  validateBody(changePasswordSchema),
  UserController.changeOwnPassword
);

// Admin-only routes
// router.use(authorize(['admin']));

// User management routes
router.get('/', validateQuery(userQuerySchema), UserController.getUsers);

router.get('/:id', validateParams(userParamsSchema), UserController.getUser);

router.put(
  '/:id',
  validateParams(userParamsSchema),
  validateBody(updateUserSchema),
  UserController.updateUser
);

router.delete('/:id', validateParams(userParamsSchema), UserController.deleteUser);

router.patch(
  '/:id/change-password',
  validateParams(userParamsSchema),
  validateBody(changePasswordSchema),
  UserController.changePassword
);

export default router;
