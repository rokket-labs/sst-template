import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { UpdateUserInput } from 'src/schema/user/user.dto'
import { User } from 'src/schema/user/user.schema'
import UserService from 'src/service/user/user.service'
import Context from 'src/types/context'

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService()
  }

  // @Mutation(() => User)
  // createUser(@Arg('input') input: CreateUserInput) {
  //   return this.userService.createUser(input)
  // }

  @Mutation(() => User)
  updateUser(@Arg('input') input: UpdateUserInput) {
    return this.userService.updateUser(input)
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.context.user
  }
}
