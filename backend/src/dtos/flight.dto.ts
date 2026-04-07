// Defines Data Transfer Objects (DTOs) used for communication between the server and clients.
// DTOs ensure that only relevant and safe data is exposed while maintaining a clear contract
// for requests and responses across the application.

export interface FlightResponseDto {
  id: string;
  origin: string;
  destination: string;
  time_departure: string; // ISO string for de response
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlightDto {
  origin: string;
  destination: string;
  time_departure: string;
}

export interface UpdateFlightDto {
  origin?: string;
  destination?: string;
  time_departure?: string;
  status?: string;
}
