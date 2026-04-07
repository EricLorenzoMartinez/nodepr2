// Defines the structure of a Flight object using a TypeScript interface.
// Ensures type safety throughout the application when working with flights.

export interface IFlight {
  id: string;
  origin: string;
  destination: string;
  time_departure: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

type SystemKeys = 'id' | 'createdAt' | 'updatedAt';
export type EditableFlight = Omit<IFlight, SystemKeys>;

export type IFlightCreate = EditableFlight;
export type IFlightUpdate = Partial<EditableFlight>;
