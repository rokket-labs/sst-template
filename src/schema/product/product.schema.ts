import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose'
import { customAlphabet } from 'nanoid'
import { Field, ObjectType } from 'type-graphql'

import {
  PaginatedModel,
  PaginatedMongoModel,
} from 'src/utils/schemas/PaginatedModel'

import { User } from '../user/user.schema'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 10)

@ObjectType()
@index({ productId: 1 })
export class Product extends PaginatedModel {
  @Field(() => String)
  _id: string

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>

  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => String)
  @prop({ required: true })
  description: string

  @Field(() => String)
  @prop({ required: true })
  price: string

  @Field(() => String)
  @prop({ required: true, default: () => `product_${nanoid()}`, unique: true })
  productId: string
}

@ObjectType()
export class PaginatedProducts extends PaginatedMongoModel {
  @Field(() => [Product])
  docs: Product[]
}

export const ProductModel = getModelForClass<typeof Product>(Product)
