import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { GetStationsArgs } from '../args/get-stations.args';
import { StationModel } from '../models/station.model';

@Injectable()
export class StationService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getStation(args: GetStationsArgs): Promise<StationModel> {
    // TODO: implement fetching station from the OpenData service
    return {} as any;
  }

  public async getStations(args: GetStationsArgs): Promise<StationModel[]> {
    const stations = await this.opendataService.getStations({
      query: args.query,
    });

    return stations.map((station) => ({
      id: station.id,
      name: station.name,
      coordinates: {
        latitude: station.coordinate.x,
        longitude: station.coordinate.y,
      },
    }));
  }
}
