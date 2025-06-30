import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import httpStatus from 'http-status';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const authResponse = await AuthService.login(req.body);
      res.status(httpStatus.OK).json({
        status: 'success',
        data: authResponse,
      });
    } catch (error: any) {
      res.status(error.statusCode || httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const authResponse = await AuthService.register(req.body);
      res.status(httpStatus.CREATED).json({
        status: 'success',
        data: authResponse,
      });
    } catch (error: any) {
      res.status(error.statusCode || httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const authResponse = await AuthService.refreshToken(req.body.refreshToken);
      res.status(httpStatus.OK).json({
        status: 'success',
        data: authResponse,
      });
    } catch (error: any) {
      res.status(error.statusCode || httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}
