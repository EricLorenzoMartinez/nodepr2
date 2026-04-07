// Manages HTTP requests related to flights.
// Contains methods for handling routes like GET, POST, PUT, DELETE for flights.
// Delegates business logic to the flight service.

import { NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { FlightService } from '../services/flight.service';
import { AppError } from '../utils/application.error';
import {
  toFlightResponse,
  toCreateFlightInput,
  toUpdateFlightInput,
} from '../mappers/flight.mapper';

export class FlightController {
  private readonly flightService: FlightService;

  constructor() {
    this.flightService = new FlightService();
  }

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received getById request for flight id: ${req.params.id}`
    );
    try {
      const flightId = req.params.id;
      const flight = await this.flightService.getById(flightId);
      const data = toFlightResponse(flight);

      const response = {
        message: 'Flight fetched successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id },
        'Controller: Error fetching flight by id'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching flight by id',
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
      const flights = await this.flightService.getAll(pagination);
      const data = flights.map(toFlightResponse);

      const response = {
        message: 'Flights fetched successfully',
        length: flights.length,
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug('Controller: Error fetching flights');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching flights',
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
      'Controller: Received request to create a new flight'
    );
    try {
      const flightToCreate = toCreateFlightInput(req.body);
      const flight = await this.flightService.create(flightToCreate);
      const data = toFlightResponse(flight);

      const response = {
        message: 'Flight created successfully',
        data: data,
      };
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ body: req.body }, 'Controller: Error creating flight');
      if (!(error instanceof AppError)) {
        appError = new AppError(
          'Error creating flight',
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
      `Controller: Received request to update flight id: ${req.params.id}`
    );
    try {
      const flightId = req.params.id;

      const flightToUpdate = toUpdateFlightInput(req.body);
      const flight = await this.flightService.update(flightId, flightToUpdate);
      const data = toFlightResponse(flight);

      const response = {
        message: 'Flight updated successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id, body: req.body },
        'Controller: Error updating flight'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error updating flight',
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
      `Controller: Received request to delete flight id: ${req.params.id}`
    );
    try {
      const flightId = req.params.id;
      const flight = await this.flightService.delete(flightId);
      const data = toFlightResponse(flight);

      const response = {
        message: 'Flight deleted successfully',
        data: data,
      };
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ id: req.params.id }, 'Controller: Error deleting flight');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error deleting flight',
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
