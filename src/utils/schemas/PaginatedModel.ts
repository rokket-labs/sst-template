import { plugin } from '@typegoose/typegoose'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { Field, ObjectType } from 'type-graphql'

type PaginateMethod<T> = (
  query?: FilterQuery<T>,
  options?: PaginateOptions,
  callback?: (err: unknown, result: PaginateResult<PaginatedModel>) => void,
) => Promise<PaginateResult<T>>

@plugin(mongoosePaginate)
export class PaginatedModel {
  static paginate: PaginateMethod<PaginatedModel>
}

@ObjectType()
export class PaginatedMongoModel {
  @Field()
  totalDocs: number

  @Field()
  limit: number

  @Field()
  page: number

  @Field()
  totalPages: number

  @Field()
  hasNextPage: boolean

  @Field({ nullable: true })
  nextPage?: number

  @Field()
  hasPrevPage: boolean

  @Field({ nullable: true })
  prevPage?: number

  @Field()
  pagingCounter: number
}
