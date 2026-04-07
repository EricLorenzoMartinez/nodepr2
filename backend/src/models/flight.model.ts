// Mongoose schema and model definition for the Flight entity.
// Defines the structure of flight documents in the database.

import mongoose from 'mongoose';
import { IFlight } from '../interfaces/flight.interface';

export interface IFlightModel extends Omit<IFlight, 'id'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const flightSchema = new mongoose.Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    time_departure: { type: Date, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields automatically
  }
);

export const FlightModel = mongoose.model<IFlightModel>('Flight', flightSchema);
