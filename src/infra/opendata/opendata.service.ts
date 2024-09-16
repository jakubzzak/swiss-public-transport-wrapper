import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { GetConnectionsParams, GetStationsParams } from './interfaces';
import { ConnectionSchema, StationSchema } from './schemas';

@Injectable()
export class OpendataService {
  private baseUrl = 'https://transport.opendata.ch/v1/';
  /**
   * The `HttpService` is a wrapper around the `Axios` HTTP client.
   * If you are not familiar with the Nest.js `HttpService`, feel free to use the underlying Axios instance directly.
   *
   * ```ts
   * this.httpService.axiosRef.get(...)
   * ```
   *
   * @see https://docs.nestjs.com/techniques/http-module
   */
  constructor(private httpService: HttpService) {}

  public async getStationById(id: string): Promise<StationSchema> {
    const res = await this.httpService.axiosRef.get('stationboard', {
      baseURL: this.baseUrl,
      params: { id },
    });

    return {
      id: res.data.station.id,
      name: res.data.station.name,
      coordinate: {
        x: res.data.station.coordinate.x,
        y: res.data.station.coordinate.y,
      },
    } as StationSchema;
  }

  public async getStations(
    params: GetStationsParams,
  ): Promise<StationSchema[]> {
    const res: { stations: object[] } = await lastValueFrom(
      this.httpService
        .get('locations', {
          baseURL: this.baseUrl,
          params: { ...params, type: 'station' },
        })
        .pipe(map((resp) => resp.data)),
    );

    return res.stations
      .map(
        (station: any) =>
          ({
            id: station.id,
            name: station.name,
            coordinate: {
              x: station.coordinate.x,
              y: station.coordinate.y,
            },
          } as StationSchema),
      )
      .filter((station) => station.id);
  }

  public async getConnections(
    params: GetConnectionsParams,
  ): Promise<ConnectionSchema[]> {
    const res: {
      connections: {
        from: {
          station: StationSchema;
          departure: string;
          departureTimestamp: number;
        };
        to: {
          station: StationSchema;
          arrival: string;
        };
        sections: {
          departure: {
            station: StationSchema;
            arrival: string;
            departure: string;
            departureTimestamp: number;
          };
          arrival: {
            station: StationSchema;
            arrival: string;
            departure: string;
            departureTimestamp: number;
          };
        }[];
      }[];
      from: StationSchema;
      to: StationSchema;
    } = await lastValueFrom(
      this.httpService
        .get('connections', { baseURL: this.baseUrl, params })
        .pipe(map((resp) => resp.data)),
    );

    return res.connections.map((connection) => ({
      from: {
        station: connection.from.station,
        departure: connection.from.departure,
        departureTimestamp: connection.from.departureTimestamp,
      },
      to: {
        station: connection.to.station,
        arrival: connection.to.arrival,
      },
      sections: connection.sections,
    }));
  }
}
