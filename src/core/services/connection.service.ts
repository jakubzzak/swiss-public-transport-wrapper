import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { GetConnectionsArgs } from '../args/get-connections.args';
import {
  decodeCursor,
  encodeCursor,
  mapStation,
  toDateString,
  toTimeString,
} from '../helpers';
import { ConnectionListModel } from '../models';

@Injectable()
export class ConnectionService {
  private maxConnections = 2;

  constructor(private readonly opendataService: OpendataService) {}

  public async getConnections(
    args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    const page = decodeCursor(args.after ?? undefined);
    const connections = await this.opendataService.getConnections({
      from: args.from,
      to: args.to,
      via: args.via ?? undefined,
      date: args.departsAt ? toDateString(args.departsAt) : undefined,
      time: args.departsAt ? toTimeString(args.departsAt) : undefined,
      page,
      limit: this.maxConnections,
    });

    return {
      nodes: connections.map((connection) => ({
        from: mapStation(connection.from.station),
        to: mapStation(connection.to.station),
        departure: new Date(connection.from.departure),
        arrival: new Date(connection.to.arrival),
        sections: connection.sections.map((section) => ({
          from: mapStation(section.departure.station),
          to: mapStation(section.arrival.station),
          departure: new Date(section.departure.departure),
          arrival: new Date(section.arrival.arrival),
        })),
      })),
      pageInfo: {
        endCursor:
          connections.length < this.maxConnections
            ? null
            : encodeCursor(page + 1),
      },
    };
  }
}
