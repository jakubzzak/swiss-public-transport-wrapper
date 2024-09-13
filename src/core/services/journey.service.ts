import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { InjectDb } from '~/infra/database';
import { GetJourneyArgs } from '../args/get-journey.args';
import { SaveJourneyArgs } from '../args/save-journey.args';
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
    // TODO: implement fetchig journey from database
    const res = await sql<
      JourneyModel[]
    >`select * from journey where id=${args.id}`.execute(this.db);
    return res.rows[0][0];
  }

  public async saveJourney(args: SaveJourneyArgs): Promise<string> {
    // TODO: implement saving journey to database, returning the id.
    const res = await this.db.transaction().execute(async (trx) => {
      const values = [args.from, args.to, JSON.stringify(args.via)];
      return await sql<
        JourneyModel[]
      >`insert into journey (id, from, to, via) values ${sql.join(
        values,
      )} returning *`.execute(trx);
    });
    return res.rows[0][0].id;
  }
}
