import { StationSchema } from '~/infra/opendata';

export const mapStation = (station: StationSchema) => {
  return {
    id: station.id,
    name: station.name,
    coordinates: {
      latitude: station.coordinate.x,
      longitude: station.coordinate.y,
    },
  };
};
