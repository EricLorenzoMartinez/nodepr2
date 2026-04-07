// Defines Data Transfer Objects (DTOs) used for communication between the server and clients.
// DTOs ensure that only relevant and safe data is exposed while maintaining a clear contract
// for requests and responses across the application.

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  birthday: string; // ISO string for de response
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithTokenResponseDto {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthday: string; // "1990-01-01" o ISO
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  birthday?: string; // "1990-01-01" o ISO
  isBlocked?: boolean;
}

export interface UserCredentialsDto {
  email: string;
  password: string;
}
