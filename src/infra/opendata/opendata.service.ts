import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { GetConnectionsParams, GetStationsParams } from './interfaces';
import { ConnectionSchema, StationSchema } from './schemas';

@Injectable()
export class OpendataService {
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

  public async getStations(
    params: GetStationsParams,
  ): Promise<StationSchema[]> {
    // TODO: ✅ implement fetching stations from OpenData API
    const url = `https://transport.opendata.ch/v1/locations?query=${params.query}&type=station`;
    const res: { stations: object[] } = await lastValueFrom(
      this.httpService.get(url).pipe(map((resp) => resp.data)),
    );

    // console.log('ress', res);
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
    const url = `http://transport.opendata.ch/v1/connections?from=${params.from}&to=${params.to}&limit=2`;
    // const url = `https://transport.opendata.ch/v1/stationboard?id=${params.stationId}&limit=2`;
    // TODO: implement fetching connections from OpenData API
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
          journey: {
            passList: {
              station: StationSchema;
              arrival: string;
              departure: string;
              departureTimestamp: number;
            }[];
          };
        }[];
      }[];
      from: StationSchema;
      to: StationSchema;
    } = await lastValueFrom(
      this.httpService.get(url).pipe(map((resp) => resp.data)),
    );
    console.log(res);

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
      sections: connection.sections[0]?.journey.passList.map((section) => ({
        departure: {
          station: section.station,
          departure: section.departure,
          departureTimestamp: section.departureTimestamp,
        },
        arrival: {
          station: section.station,
          arrival: section.arrival,
        },
      })),
    }));
  }
}
