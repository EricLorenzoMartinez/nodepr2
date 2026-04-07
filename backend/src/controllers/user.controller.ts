// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/application.error';
import {
  toUserResponse,
  toCreateUserInput,
  toUpdateUserInput,
} from '../mappers/user.mapper';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received getById request for user id: ${req.params.id}`
    );
    try {
      const userId = req.params.id;
      const user = await this.userService.getById(userId);
      const data = toUserResponse(user);

      const response = {
        message: 'User fetched successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id },
        'Controller: Error fetching user by id'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching user by id',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received getAll request with query: ${JSON.stringify(req.query)}`
    );
    try {
      const { skip = 0, limit = 0 } = req.query;
      const pagination = {
        skip: parseInt(skip as string, 10),
        limit: parseInt(limit as string, 10),
      };
      const users = await this.userService.getAll(pagination);
      const data = users.map(toUserResponse);

      const response = {
        message: 'Users fetched successfully',
        length: users.length,
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug('Controller: Error fetching users');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching users',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      { body: req.body },
      'Controller: Received request to create a new user'
    );
    try {
      const userToCreate = toCreateUserInput(req.body);
      const user = await this.userService.create(userToCreate);
      const data = toUserResponse(user);

      const response = {
        message: 'User created successfully',
        data: data,
      };
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ body: req.body }, 'Controller: Error creating user');
      if (!(error instanceof AppError)) {
        appError = new AppError(
          'Error creating user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            body: req.body,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      { body: req.body },
      `Controller: Received request to update user id: ${req.params.id}`
    );
    try {
      const userId = req.params.id;

      const userToUpdate = toUpdateUserInput(req.body);
      const user = await this.userService.update(userId, userToUpdate);
      const data = toUserResponse(user);

      const response = {
        message: 'User updated successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id, body: req.body },
        'Controller: Error updating user'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error updating user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            body: req.body,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received request to delete user id: ${req.params.id}`
    );
    try {
      const userId = req.params.id;
      const user = await this.userService.delete(userId);
      const data = toUserResponse(user);

      const response = {
        message: 'User deleted successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ id: req.params.id }, 'Controller: Error deleting user');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error deleting user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };
}
