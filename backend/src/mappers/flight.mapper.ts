// Defines pure transformation functions for mapping between Flight domain types and DTOs.
// To adapt data across architectural layers.

import {
  IFlight,
  IFlightCreate,
  IFlightUpdate,
} from '../interfaces/flight.interface';
import {
  FlightResponseDto,
  CreateFlightDto,
  UpdateFlightDto,
} from '../dtos/flight.dto';

export const toFlightResponse = (u: IFlight): FlightResponseDto => ({
  id: u.id,
  origin: u.origin,
  destination: u.destination,
  time_departure: u.time_departure.toISOString(),
  status: u.status,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

export const toCreateFlightInput = (dto: CreateFlightDto): IFlightCreate => ({
  origin: dto.origin,
  destination: dto.destination,
  time_departure: new Date(dto.time_departure),
  status: dto.status,
});

export const toUpdateFlightInput = (dto: UpdateFlightDto): IFlightUpdate => {
  const input: IFlightUpdate = {};

  if (dto.origin !== undefined) input.origin = dto.origin;
  if (dto.destination !== undefined) input.destination = dto.destination;
  if (dto.time_departure !== undefined)
    input.time_departure = new Date(dto.time_departure);
  if (dto.status !== undefined) input.status = dto.status;
  return input;
};
