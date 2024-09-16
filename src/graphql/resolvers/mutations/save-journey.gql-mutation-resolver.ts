import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JourneyModel } from '~/core/models';
import { JourneyService, StationService } from '~/core/services';
import { SaveJourneyGqlArgs } from '../../args';

@Resolver()
export class SaveJourneyGqlMutationResolver {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly stationService: StationService,
  ) {}

  @Mutation(() => JourneyModel)
  public async saveJourney(
    @Args() args: SaveJourneyGqlArgs,
  ): Promise<JourneyModel> {
    const [fromStation, toStation, ...viaStations] = await Promise.all([
      this.stationService.getStation({
        query: args.from,
      }),
      this.stationService.getStation({
        query: args.to,
      }),
      ...(args.via ?? []).map((stationId) =>
        this.stationService.getStation({
          query: stationId,
        }),
      ),
    ]);

    const journeyId = await this.journeyService.saveJourney({
      from: fromStation,
      to: toStation,
      via: viaStations,
    });

    return {
      id: journeyId,
      from: fromStation,
      to: toStation,
      via: viaStations,
    };
  }
}
