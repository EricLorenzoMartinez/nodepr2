// Implements business logic for authorization operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';
import { UserRepository } from '../repositories/user.repository';
import { PasswordHelper } from '../utils/password.helper';
import { TokenHelper } from '../utils/token.helper';
import { IUserCredentials, IUserWithToken } from '../interfaces/user.interface';

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly defaultProjection: Record<string, boolean>;

  constructor() {
    this.userRepository = new UserRepository();
    this.defaultProjection = {
      id: true,
      name: true,
      email: true,
      password: false,
      birthday: false,
      isBlocked: false,
      createdAt: false,
      updatedAt: false,
    };
  }

  login = async (user: IUserCredentials): Promise<IUserWithToken> => {
    logger.debug(`AuthService: Attempting login for email: ${user.email}`);
    const projection = { ...this.defaultProjection, password: true };
    const foundUser = await this.userRepository.getByEmail(
      user.email,
      projection
    );
    if (!foundUser) {
      logger.warn(`AuthService: User not found for email: ${user.email}`);
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    if (foundUser.isBlocked) {
      logger.warn(`AuthService: User with email ${user.email} is blocked`);
      throw new AppError('User is blocked', httpStatus.FORBIDDEN);
    }
    const isPasswordValid = await PasswordHelper.comparePasswords(
      user.password,
      foundUser.password
    );
    if (!isPasswordValid) {
      logger.warn(`AuthService: Invalid password for email: ${user.email}`);
      throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
    }
    const token = TokenHelper.generateToken({ id: foundUser.id });
    logger.info(`AuthService: Login successful for email: ${user.email}`);
    return { ...foundUser, token };
  };
}
