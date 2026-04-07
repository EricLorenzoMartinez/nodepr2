// Handles direct data operations related to users.
// This layer interacts with the database or a data source to perform CRUD operations.

import logger from '../config/logger';
import { IUserModel, UserModel } from '../models/user.model';
import { IUser, IUserCreate, IUserUpdate } from '../interfaces/user.interface';
import { BaseRepository } from './base.repository';

export class UserRepository {
  private readonly baseRepository: BaseRepository<IUserModel>;

  constructor() {
    this.baseRepository = new BaseRepository(UserModel);
  }

  getById = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IUser | null> => {
    logger.debug(`Repository: Fetching user by id: ${id}`);
    const userFound = await this.baseRepository.getById(id, projection);
    if (!userFound) {
      logger.debug(`Repository: No user found with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} fetched and transformed`);
    return userFound as IUser;
  };

  find = async (
    filters: Record<string, unknown> = {},
    projection: Record<string, boolean> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 }
  ): Promise<IUser[]> => {
    const options = { ...pagination };
    logger.debug(
      `Repository: Finding users with filters: ${JSON.stringify(filters)} and pagination: ${JSON.stringify(pagination)}`
    );
    const users = await this.baseRepository.find<IUserModel>(
      filters,
      projection,
      options
    );
    logger.debug(`Repository: Found ${users.length} users`);
    return users as IUser[];
  };

  create = async (
    data: IUserCreate,
    projection: Record<string, boolean>
  ): Promise<IUser | null> => {
    logger.debug({ data }, 'Repository: Creating user with data');
    const createdUser = await this.baseRepository.create(data, projection);
    if (!createdUser) {
      logger.debug('Repository: User creation returned null');
      return null;
    }
    logger.debug({ user: createdUser }, 'Repository: User created');
    return createdUser as IUser;
  };

  getByEmail = async (
    email: string,
    projection: Record<string, boolean>
  ): Promise<IUser | null> => {
    logger.debug(`Repository: Fetching user by email: ${email}`);
    const filters = { email };
    const userFound = await this.baseRepository.findOne(filters, projection);
    if (!userFound) {
      logger.debug(`Repository: No user found with email: ${email}`);
      return null;
    }
    logger.debug(
      `Repository: User with email ${email} fetched and transformed`
    );
    return userFound as IUser;
  };

  update = async (
    id: string,
    data: IUserUpdate,
    projection: Record<string, boolean>
  ): Promise<IUser | null> => {
    logger.debug({ data }, `Repository: Updating user with id: ${id}`);
    const updatedUser = await this.baseRepository.update(id, data, projection);
    if (!updatedUser) {
      logger.debug(`Repository: No user found to update with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} updated and transformed`);
    return updatedUser as IUser;
  };

  delete = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IUser | null> => {
    logger.debug(`Repository: Deleting user with id: ${id}`);
    const userDeleted = await this.baseRepository.delete(id, projection);
    if (!userDeleted) {
      logger.warn(`Repository: No user found to delete with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: User with id ${id} deleted and transformed`);
    return userDeleted as IUser;
  };
}
