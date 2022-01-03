import { Field, InputType } from 'type-graphql'

@InputType()
export class PaginatedInputOptions {
  @Field({ nullable: true, defaultValue: 1 })
  page: number

  @Field({ nullable: true, defaultValue: 10 })
  limit: number

  @Field({ nullable: true, defaultValue: 0 })
  offset: number

  @Field({ nullable: true })
  select?: string

  @Field({ nullable: true })
  sort?: string

  @Field({ nullable: true })
  populate?: string

  @Field({ nullable: true, defaultValue: false })
  lean: boolean

  @Field({ nullable: true, defaultValue: true })
  pagination: boolean
}
