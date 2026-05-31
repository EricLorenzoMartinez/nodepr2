// Handles database connection and configuration.
// This file is responsible for setting up and exporting the database instance.

import mongoose, { type ConnectOptions } from 'mongoose';
import { DATABASE_URL } from './config';
import logger from './logger';
import { logError } from '../utils/logger.helper';
import { UserModel } from '../models/user.model';
import { mainModule } from 'process';

const createSupportUser = async () => {
  try {
    const supportExists = await UserModel.findOne({
      email: 'support@mail.com',
    });
    if (!supportExists) {
      await UserModel.create({
        name: 'Support',
        email: 'support@mail.com',
        password: 'support123',
        birthday: new Date(),
      });
      logger.info('Support user created successfully');
    }
  } catch (error) {
    logError(error, 'Error creating support user');
  }
};

export const createConnection = async () => {
  try {
    const options: ConnectOptions = {};

    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    logger.info('Attempting to connect to the DB...');
    await mongoose.connect(DATABASE_URL, options);
    logger.info('Connected to the DB');

    await createSupportUser();

    mongoose.connection.on('error', (error: unknown) => {
      logError(error, 'The connection was interrupted');
      process.exit(1);
    });
  } catch (error: unknown) {
    logError(error, 'Cannot connect to the DB');
    process.exit(1);
  }
};

export const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error: unknown) {
    logError(error, 'Error closing the database connection');
  }
};
