import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ApiError } from '../../utils/ApiError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

export class UserController {
  /**
   * Create a new user
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(httpStatus.CREATED).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to create user',
      });
    }
  }

  /**
   * Get all users
   */
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers(req.query);
      res.status(httpStatus.OK).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to fetch users',
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
      res.status(httpStatus.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to fetch user',
      });
    }
  }

  /**
   * Update user
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
      }

      const user = await UserService.updateUser(userId, req.body);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
      res.status(httpStatus.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to update user',
      });
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
      }

      const success = await UserService.deleteUser(userId);
      if (!success) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
      res.status(httpStatus.NO_CONTENT).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to delete user',
      });
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
      }

      await UserService.changePassword(userId, req.body);
      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Password changed successfully',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to change password',
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }

      const user = await UserService.getUserById(req.user.id);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      res.status(httpStatus.OK).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to fetch user profile',
      });
    }
  }

  /**
   * Change current user password
   */
  static async changeOwnPassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }

      await UserService.changePassword(req.user.id, req.body);
      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Password changed successfully',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to change password',
      });
    }
  }
}
