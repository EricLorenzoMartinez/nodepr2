// Defines pure transformation functions for mapping between User domain types and DTOs.
// To adapt data across architectural layers.

import {
  IUser,
  IUserCreate,
  IUserUpdate,
  IUserCredentials,
  IUserWithToken,
} from '../interfaces/user.interface';
import {
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  UserCredentialsDto,
  UserWithTokenResponseDto,
} from '../dtos/user.dto';

export const toUserResponse = (u: IUser): UserResponseDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  birthday: u.birthday.toISOString(),
  isBlocked: u.isBlocked,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

export const toUserWithTokenResponse = (
  u: IUserWithToken
): UserWithTokenResponseDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  token: u.token,
});

export const toCreateUserInput = (dto: CreateUserDto): IUserCreate => ({
  name: dto.name,
  email: dto.email,
  password: dto.password,
  birthday: new Date(dto.birthday),
  isBlocked: false,
});

export const toUpdateUserInput = (dto: UpdateUserDto): IUserUpdate => {
  const input: IUserUpdate = {};

  if (dto.name !== undefined) input.name = dto.name;
  if (dto.email !== undefined) input.email = dto.email;
  if (dto.password !== undefined) input.password = dto.password;
  if (dto.birthday !== undefined) input.birthday = new Date(dto.birthday);
  if (dto.isBlocked !== undefined) input.isBlocked = dto.isBlocked;

  return input;
};

export const toUserCredentials = (
  body: UserCredentialsDto
): IUserCredentials => ({
  email: body.email,
  password: body.password,
});
