// Handles direct data operations related to flights.
// This layer interacts with the database or a data source to perform CRUD operations.

import logger from '../config/logger';
import { IFlightModel, FlightModel } from '../models/flight.model';
import {
  IFlight,
  IFlightCreate,
  IFlightUpdate,
} from '../interfaces/flight.interface';
import { BaseRepository } from './base.repository';

export class FlightRepository {
  private readonly baseRepository: BaseRepository<IFlightModel>;

  constructor() {
    this.baseRepository = new BaseRepository(FlightModel);
  }

  getById = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug(`Repository: Fetching flight by id: ${id}`);
    const flightFound = await this.baseRepository.getById(id, projection);
    if (!flightFound) {
      logger.debug(`Repository: No flight found with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} fetched`);
    return flightFound as IFlight;
  };

  find = async (
    filters: Record<string, unknown> = {},
    projection: Record<string, boolean> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 }
  ): Promise<IFlight[]> => {
    const options = { ...pagination };
    logger.debug(
      `Repository: Finding flights with filters: ${JSON.stringify(filters)} and pagination: ${JSON.stringify(pagination)}`
    );
    const flights = await this.baseRepository.find<IFlightModel>(
      filters,
      projection,
      options
    );
    logger.debug(`Repository: Found ${flights.length} flights`);
    return flights as IFlight[];
  };

  create = async (
    data: IFlightCreate,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug({ data }, 'Repository: Creating flight with data');
    const createdFlight = await this.baseRepository.create(data, projection);
    if (!createdFlight) {
      logger.debug('Repository: Flight creation returned null');
      return null;
    }
    logger.debug({ flight: createdFlight }, 'Repository: Flight created');
    return createdFlight as IFlight;
  };

  update = async (
    id: string,
    data: IFlightUpdate,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug({ data }, `Repository: Updating flight with id: ${id}`);
    const updatedFlight = await this.baseRepository.update(
      id,
      data,
      projection
    );
    if (!updatedFlight) {
      logger.debug(`Repository: No flight found to update with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} updated`);
    return updatedFlight as IFlight;
  };

  delete = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug(`Repository: Deleting flight with id: ${id}`);
    const flightDeleted = await this.baseRepository.delete(id, projection);
    if (!flightDeleted) {
      logger.warn(`Repository: No flight found to delete with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} deleted`);
    return flightDeleted as IFlight;
  };
}
