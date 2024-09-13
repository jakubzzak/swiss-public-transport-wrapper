import { Injectable } from '@nestjs/common';
import { OpendataService, StationSchema } from '~/infra/opendata';
import { GetConnectionsArgs } from '../args/get-connections.args';
import { ConnectionListModel } from '../models';

@Injectable()
export class ConnectionService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getConnections(
    args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    // TODO: get connections from the OpenData service
    const connections = await this.opendataService.getConnections({
      from: args.from,
      to: args.to,
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
        endCursor: 'todo',
      },
    };
  }
}

const mapStation = (station: StationSchema) => {
  return {
    id: station.id,
    name: station.name,
    coordinates: {
      latitude: station.coordinate.x,
      longitude: station.coordinate.y,
    },
  };
};
