import { Injectable } from '@nestjs/common';
import { OpendataService } from '~/infra/opendata';
import { GetStationsArgs } from '../args/get-stations.args';
import { mapStation } from '../helpers';
import { StationModel } from '../models/station.model';

@Injectable()
export class StationService {
  constructor(private readonly opendataService: OpendataService) {}

  public async getStation(args: GetStationsArgs): Promise<StationModel> {
    const station = await this.opendataService.getStationById(args.query);
    return mapStation(station);
  }

  public async getStations(args: GetStationsArgs): Promise<StationModel[]> {
    const stations = await this.opendataService.getStations({
      query: args.query,
    });

    return stations.map(mapStation);
  }
}
