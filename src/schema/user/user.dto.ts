import { Field, InputType } from 'type-graphql'

export class CreateUserInput {
  email: string
  sub: string
}

@InputType()
export class UpdateUserInput {
  @Field()
  email: string

  @Field({ nullable: true })
  name?: string
}
