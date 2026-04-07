// Defines the routes for flight-related operations.
// Maps HTTP methods and endpoints to the corresponding controller methods.

import { Router } from 'express';
import { FlightController } from '../controllers/flight.controller';
import { FlightValidator } from '../validators/flight.validator';
import { validate, ValidationSource } from '../middlewares/validate.middleware';
import { checkToken } from '../middlewares/auth.middleware';

const flightController = new FlightController();
export const flightRouter = Router();

flightRouter.get(
  '/:id',
  validate(FlightValidator.flightIdSchema, ValidationSource.PARAMS),
  flightController.getById
);
flightRouter.get(
  '/',
  validate(FlightValidator.flightPaginationSchema, ValidationSource.QUERY),
  flightController.getAll
);
flightRouter.post(
  '/',
  checkToken,
  validate(FlightValidator.flightCreateSchema, ValidationSource.BODY),
  flightController.create
);
flightRouter.put(
  '/:id',
  checkToken,
  validate(FlightValidator.flightIdSchema, ValidationSource.PARAMS),
  validate(FlightValidator.flightUpdateSchema, ValidationSource.BODY),
  flightController.update
);
flightRouter.delete(
  '/:id',
  checkToken,
  validate(FlightValidator.flightIdSchema, ValidationSource.PARAMS),
  flightController.delete
);
