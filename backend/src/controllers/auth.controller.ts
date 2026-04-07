// Manages HTTP requests related to authentication.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/application.error';
import {
  toUserCredentials,
  toUserResponse,
  toUserWithTokenResponse,
} from '../mappers/user.mapper';

export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received login request for email: ${req.body.email}`
    );
    try {
      const userToAuth = toUserCredentials(req.body);
      const user = await this.authService.login(userToAuth);
      const data = toUserWithTokenResponse(user);

      const response = {
        message: 'Login successful',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        `Controller: Error during login for email: ${req.body.email}`
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Login failed',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            email: req.body.email,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      { body: req.body },
      `Controller: Received registration request for email: ${req.body.email}`
    );
    try {
      logger.debug(`User registration attempt: ${req.body.email}`);
      const user = await this.userService.create(req.body);
      const data = toUserResponse(user);

      logger.info('User registered successfully');
      const response = {
        message: 'User registered successfully',
        data: data,
      };
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { email: req.body.email, body: req.body },
        'Controller: Error during registration'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Registration failed',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            email: req.body.email,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };
}
