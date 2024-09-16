import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ConnectionListModel, JourneyModel } from '~/core/models';
import { ConnectionService } from '~/core/services';

@Resolver(() => JourneyModel)
export class JourneyGqlModelResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  @ResolveField('connections', () => ConnectionListModel)
  public async connections(
    @Parent() journey: JourneyModel,
    @Args('departsAt') departsAt?: Date,
  ): Promise<ConnectionListModel> {
    return await this.connectionService.getConnections({
      from: journey.from.id,
      to: journey.to.id,
      via: journey.via.map((station) => station.id),
      departsAt,
    });
  }
}
