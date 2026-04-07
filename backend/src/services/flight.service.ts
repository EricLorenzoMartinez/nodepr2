// Implements business logic for flight operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';
import { FlightRepository } from '../repositories/flight.repository';
import { PasswordHelper } from '../utils/password.helper';
import {
  IFlight,
  IFlightCreate,
  EditableFlight,
  IFlightUpdate,
} from '../interfaces/flight.interface';

export class FlightService {
  private readonly flightRepository: FlightRepository;
  private readonly defaultProjection: Record<string, boolean>;

  constructor() {
    this.flightRepository = new FlightRepository();
    this.defaultProjection = {
      id: true,
      origin: true,
      destination: true,
      time_departure: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  private readonly normalizeFlightData = (
    data: Partial<EditableFlight>
  ): Partial<EditableFlight> => {
    const normalizedData = { ...data };
    if (data.time_departure && typeof data.time_departure === 'string') {
      normalizedData.time_departure = new Date(data.time_departure);
    }
    logger.debug({ normalizedData }, 'Normalized flight data');
    return normalizedData;
  };

  getById = async (id: string): Promise<IFlight> => {
    const projection = { ...this.defaultProjection };
    const flight = await this.flightRepository.getById(id, projection);
    if (!flight) {
      logger.warn(`Flight with id ${id} not found`);
      throw new AppError('Flight not found', httpStatus.NOT_FOUND);
    }
    logger.info(`Flight with id ${id} retrieved successfully`);
    return flight;
  };

  getAll = async (pagination: {
    skip: number;
    limit: number;
  }): Promise<IFlight[]> => {
    const MAX_LIMIT = 100;
    if (pagination.limit === 0 || pagination.limit > MAX_LIMIT) {
      pagination.limit = MAX_LIMIT;
      logger.debug({ pagination }, 'Pagination limit adjusted to MAX_LIMIT');
    }
    const filters = {};
    const projection = { ...this.defaultProjection };
    logger.debug(
      `Fetching all flights with filters: ${JSON.stringify(filters)} and pagination: ${JSON.stringify(pagination)}`
    );
    const flights = await this.flightRepository.find(
      filters,
      projection,
      pagination
    );
    if (!flights || flights.length === 0) {
      logger.info('No flights found');
      throw new AppError('No flights found', httpStatus.NOT_FOUND);
    }
    return flights;
  };

  create = async (data: IFlightCreate): Promise<IFlight> => {
    logger.debug({ requestData: data }, 'Starting flight creation');
    const normalizedData = this.normalizeFlightData(data) as IFlightCreate;
    const projection = { ...this.defaultProjection };
    const createdFlight = await this.flightRepository.create(
      normalizedData,
      projection
    );
    if (!createdFlight) {
      logger.warn('Flight creation failed');
      throw new AppError(
        'Flight creation failed',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    logger.info(
      `Flight created successfully with time_departure ${normalizedData.time_departure}`
    );
    return createdFlight;
  };

  update = async (id: string, data: IFlightUpdate): Promise<IFlight> => {
    logger.debug({ requestData: data }, `Starting update for flight id: ${id}`);
    const flightToUpdate = await this.flightRepository.getById(
      id,
      this.defaultProjection
    );
    if (!flightToUpdate) {
      logger.warn(`Flight with id ${id} not found for update`);
      throw new AppError('Flight not found', httpStatus.NOT_FOUND);
    }

    const normalizedData = this.normalizeFlightData(data);

    const projection = { ...this.defaultProjection };
    const flightUpdated = await this.flightRepository.update(
      id,
      normalizedData,
      projection
    );
    if (!flightUpdated) {
      logger.warn(`Flight with id ${id} not found after update attempt`);
      throw new AppError('Flight not found', httpStatus.NOT_FOUND);
    }
    logger.info(`Flight with id ${id} updated successfully`);
    return flightUpdated;
  };

  delete = async (id: string): Promise<IFlight> => {
    logger.debug(`Starting deletion for flight id: ${id}`);
    const projection = { ...this.defaultProjection };
    const flightDeleted = await this.flightRepository.delete(id, projection);
    if (!flightDeleted) {
      logger.warn(`Flight with id ${id} not found for deletion`);
      throw new AppError('Flight not found', httpStatus.NOT_FOUND);
    }
    logger.info(`Flight with id ${id} deleted successfully`);
    return flightDeleted;
  };
}
