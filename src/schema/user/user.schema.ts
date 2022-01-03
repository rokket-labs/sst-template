import { getModelForClass, prop, queryMethod } from '@typegoose/typegoose'
import { AsQueryMethod, ReturnModelType } from '@typegoose/typegoose/lib/types'
import { Field, ObjectType } from 'type-graphql'

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>
  findBySub: AsQueryMethod<typeof findBySub>
}

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User['email'],
) {
  return this.findOne({ email })
}

function findBySub(
  this: ReturnModelType<typeof User, QueryHelpers>,
  sub: User['sub'],
) {
  return this.findOne({ sub })
}

@queryMethod(findByEmail)
@queryMethod(findBySub)
@ObjectType()
export class User {
  @Field(() => String)
  _id: string

  @Field(() => String)
  @prop()
  name: string

  @prop({ required: true, unique: true, index: true })
  sub: string

  @Field(() => String)
  @prop({ required: true, unique: true })
  email: string
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User)
