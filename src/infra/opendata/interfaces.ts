export interface GetStationsParams {
  query: string;
}

export interface GetConnectionsParams {
  from: string;
  to: string;
  via?: string[];
  date?: string;
  time?: string;
  page: number;
  limit: number;
}
