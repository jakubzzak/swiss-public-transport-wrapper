import { Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectDb } from '~/infra/database';
import { GetJourneyArgs } from '../args/get-journey.args';
import { SaveJourneyArgs, SaveJourneyStation } from '../args/save-journey.args';
import { JourneyModel } from '../models';

@Injectable()
export class JourneyService {
  /**
   * Kysely is a type-safe and autocompletion-friendly TypeScript SQL query builder.
   *
   * We are assuming you are not familiar with Kysely, hence we suggest you to drop down
   * to raw SQL queries. If you are familiar with Kysely, feel free to properly type the
   * `db` property and use the respective Kysely methods.
   *
   * ### Examples
   *
   * Simple query to fetch all persons:
   *
   * ```ts
   * const result = await sql<Person[]>`select * from person`.execute(db)
   * ```
   *
   * Simple transaction, inserting multiple persons:
   *
   * ```ts
   * await db.transaction().execute(async (trx) => {
   *  const current = await sql<Person[]>`select * from person`.execute(trx)
   *  // ...
   *  const values = people.map((p) => sql`(${p.id}, ${p.name})`)
   *  const new = await sql<Person[]>`insert into person (id, name) values ${sql.join(values)} returning *`.execute(trx)
   * })
   * ```
   *
   * @see https://kysely.dev/docs/intro
   */
  constructor(@InjectDb() private readonly db: Kysely<any>) {}

  public async getJourney(args: GetJourneyArgs): Promise<JourneyModel> {
    const [journeyRecord] = await this.db
      .selectFrom('journey')
      .selectAll()
      .where('id', '=', args.id)
      .execute();

    if (!journeyRecord) {
      throw new NotFoundException(`Journey<${args.id}>`);
    }

    const stationRecords = await this.db
      .selectFrom('stations')
      .selectAll()
      .where('id', 'in', [
        journeyRecord.from,
        journeyRecord.to,
        ...journeyRecord.via,
      ])
      .execute();

    return {
      id: journeyRecord.id,
      from: mapStationRecordToStation(
        stationRecords.find(
          (stationRecord) => stationRecord.id === journeyRecord.from,
        ),
      ),
      to: mapStationRecordToStation(
        stationRecords.find(
          (stationRecord) => stationRecord.id === journeyRecord.to,
        ),
      ),
      via: Array.isArray(journeyRecord.via)
        ? stationRecords
            .filter((stationRecord) =>
              journeyRecord.via.includes(stationRecord.id),
            )
            .map(mapStationRecordToStation)
        : [],
    } as JourneyModel;
  }

  public async saveJourney(args: SaveJourneyArgs): Promise<string> {
    const res = await this.db.transaction().execute(async (trx) => {
      await trx
        .insertInto('stations')
        .values([
          mapStationToStationRecord(args.from),
          mapStationToStationRecord(args.to),
          ...args.via.map(mapStationToStationRecord),
        ])
        .onConflict((qb) => qb.column('id').doNothing())
        .execute();

      return trx
        .insertInto('journey')
        .values({
          from: args.from.id,
          to: args.to.id,
          via: args.via.map((station) => station.id),
        })
        .returningAll()
        .execute();
    });

    return res[0].id;
  }
}

const mapStationToStationRecord = (station: SaveJourneyStation) => ({
  id: station.id,
  name: station.name,
  latitude: station.coordinates.latitude,
  longitude: station.coordinates.longitude,
});
const mapStationRecordToStation = (stationRecord: any) => ({
  id: stationRecord.id,
  name: stationRecord.name,
  coordinates: {
    latitude: stationRecord.latitude,
    longitude: stationRecord.longitude,
  },
});
