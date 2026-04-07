// Defines Joi schemas for validating flight-related requests.
// Ensures that incoming data adheres to the required structure and rules.

import Joi from 'joi';

export class FlightValidator {
  private static readonly id = Joi.string().trim();
  private static readonly origin = Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .trim();
  private static readonly destination = Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .trim();
  private static readonly time_departure = Joi.string().trim();
  private static readonly status = Joi.string().valid(
    'on-time',
    'delayed',
    'cancelled'
  );
  private static readonly skip = Joi.number().min(1);
  private static readonly limit = Joi.number().min(1).max(100);

  static readonly flightIdSchema = Joi.object({
    id: FlightValidator.id.required(),
  });

  static readonly flightPaginationSchema = Joi.object({
    skip: FlightValidator.skip,
    limit: FlightValidator.limit,
  }).with('skip', 'limit');

  static readonly flightCreateSchema = Joi.object({
    origin: FlightValidator.origin.required(),
    destination: FlightValidator.destination.required(),
    time_departure: FlightValidator.time_departure.required(),
    status: FlightValidator.status.required(),
  });

  static readonly flightUpdateSchema = Joi.object({
    origin: FlightValidator.origin,
    destination: FlightValidator.destination,
    time_departure: FlightValidator.time_departure,
    status: FlightValidator.status,
  });
}
