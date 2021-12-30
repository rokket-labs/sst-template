import { getModelForClass, index, pre, prop } from '@typegoose/typegoose'
import { AsQueryMethod, ReturnModelType } from '@typegoose/typegoose/lib/types'
import bcrypt from 'bcrypt'
import { Field, ObjectType } from 'type-graphql'

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>
}

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User['email'],
) {
  return this.findOne({ email })
}

@pre<User>('save', async function () {
  // Check that the password is being modified
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)

  const hash = await bcrypt.hashSync(this.password, salt)

  this.password = hash
})
@index({ email: 1 })
@ObjectType()
export class User {
  @Field(() => String)
  _id: string

  @Field(() => String)
  @prop({ required: true })
  name: string

  @Field(() => String)
  @prop({ required: true })
  email: string

  @prop({ required: true })
  password: string
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User)
