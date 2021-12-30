import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { CreateUserInput, LoginInput } from 'src/schema/user/user.dto'
import { User } from 'src/schema/user/user.schema'
import UserService from 'src/service/user/user.service'
import Context from 'src/types/context'

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService()
  }

  @Mutation(() => User)
  createUser(@Arg('input') input: CreateUserInput) {
    return this.userService.createUser(input)
  }

  @Mutation(() => String) // Returns the JWT
  login(@Arg('input') input: LoginInput) {
    return this.userService.login(input)
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.context.user
  }
}
