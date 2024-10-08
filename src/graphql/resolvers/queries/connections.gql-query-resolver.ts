import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetConnectionsArgs } from '~/core/args';
import { ConnectionListModel } from '~/core/models';
import { ConnectionService } from '~/core/services';

@Resolver()
export class ConnectionsGqlQueryResolver {
  constructor(private readonly connectionService: ConnectionService) {}

  @Query(() => ConnectionListModel)
  public async connections(
    @Args() args: GetConnectionsArgs,
  ): Promise<ConnectionListModel> {
    return await this.connectionService.getConnections(args);
  }
}
