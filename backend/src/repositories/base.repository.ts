// A generic repository class providing common database operations.
// Can be extended by specific repositories like user.repository.ts.

import { Model, ProjectionFields } from 'mongoose';
import logger from '../config/logger';
import { omitKeys } from '../utils/omitKeys.helper';

export class BaseRepository<T> {
  private readonly model: Model<T>;
  private readonly defaultProjection: ProjectionFields<T>;

  constructor(model: Model<T>) {
    this.model = model;
    this.defaultProjection = { __v: 0 };
  }

  private transformId(doc: any): any {
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    const { _id, ...rest } = obj;
    return { ...rest, id: _id.toString() };
  }

  private mapProjection(
    projection: Record<string, boolean>
  ): Record<string, number> {
    return Object.fromEntries(
      Object.entries(projection)
        .filter(([, value]) => value === false)
        .map(([key]) => [key, 0])
    );
  }

  async getById(
    id: string,
    projection?: Record<string, boolean>
  ): Promise<T | null> {
    const mappedProjection = projection ? this.mapProjection(projection) : {};
    const projectionFields = { ...mappedProjection, ...this.defaultProjection };
    logger.debug(
      `BaseRepository: getById called with id: ${id} and projection: ${JSON.stringify(projectionFields)}`
    );
    const doc = await this.model.findById(id, projectionFields);
    if (!doc) return null;
    return this.transformId(doc);
  }

  async find<Doctype>(
    filters: Record<string, unknown>,
    projection?: Record<string, boolean>,
    options?: Record<string, unknown>
  ): Promise<T[]> {
    const mappedProjection = projection ? this.mapProjection(projection) : {};
    const projectionFields = { ...mappedProjection, ...this.defaultProjection };
    logger.debug(
      `BaseRepository: find called with filters: ${JSON.stringify(filters)}, projection: ${JSON.stringify(projectionFields)}, options: ${JSON.stringify(options)}`
    );
    const docs = await this.model.find(
      filters,
      projectionFields,
      options || {}
    );
    return docs.map((doc) => this.transformId(doc));
  }

  async create(
    data: Partial<T>,
    projection: Record<string, boolean>
  ): Promise<T> {
    logger.debug(
      `BaseRepository: create called with data: ${JSON.stringify(data)}`
    );
    const record = await this.model.create(data);
    const recordObject = record.toObject({ versionKey: false }); // { __v: 0 }
    // Transform _id to id
    const transformed = this.transformId(recordObject);
    // Sacamos esas claves según la proyección proporcionada
    const mappedProjection = this.mapProjection(projection);
    const keysToOmit = Object.keys(mappedProjection).filter(
      (k) => mappedProjection[k] === 0
    ) as (keyof typeof transformed)[];

    const clean = omitKeys(transformed, keysToOmit);
    return clean as T;
  }

  async findOne(
    filters: Record<string, unknown>,
    projection?: Record<string, boolean>
  ): Promise<T | null> {
    const mappedProjection = projection ? this.mapProjection(projection) : {};
    const projectionFields = { ...mappedProjection, ...this.defaultProjection };
    logger.debug(
      `BaseRepository: findOne called with filters: ${JSON.stringify(filters)}, projection: ${JSON.stringify(projectionFields)}`
    );
    const doc = await this.model.findOne(filters, projectionFields);
    if (!doc) return null;
    return this.transformId(doc);
  }

  async update(
    id: string,
    data: Partial<T>,
    projection: Record<string, boolean>,
    options?: Record<string, boolean>
  ): Promise<T | null> {
    const filters = { _id: id };
    const mappedProjection = projection ? this.mapProjection(projection) : {};
    const defaultOptions = {
      ...options,
      select: { ...this.defaultProjection, ...mappedProjection },
      new: true,
    };
    logger.debug(
      `BaseRepository: update called with id: ${id}, data: ${JSON.stringify(data)}, options: ${JSON.stringify(defaultOptions)}`
    );
    const doc = await this.model.findOneAndUpdate(
      filters,
      data,
      defaultOptions
    );
    if (!doc) return null;
    return this.transformId(doc);
  }

  async delete(
    id: string,
    projection: Record<string, boolean>,
    options?: Record<string, boolean>
  ): Promise<T | null> {
    const filters = { _id: id };
    const mappedProjection = projection ? this.mapProjection(projection) : {};
    const defaultOptions = {
      ...options,
      select: { ...this.defaultProjection, ...mappedProjection },
    };
    logger.debug(
      `BaseRepository: delete called with id: ${id}, options: ${JSON.stringify(defaultOptions)}`
    );
    const doc = await this.model.findOneAndDelete(filters, defaultOptions);
    if (!doc) return null;
    return this.transformId(doc);
  }
}
