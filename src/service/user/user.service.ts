import { ApolloError } from 'apollo-server-lambda'
import bcrypt from 'bcryptjs'

import { CreateUserInput, LoginInput } from 'src/schema/user/user.dto'
import { UserModel } from 'src/schema/user/user.schema'
import Context from 'src/types/context'
import { signJwt } from 'src/utils/jwt'

export default class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input)
  }

  async login(input: LoginInput, context: Context) {
    const e = 'Invalid email or password'

    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean()

    if (!user) throw new ApolloError(e)

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password)

    if (!passwordIsValid) throw new ApolloError(e)

    // sign a jwt
    const token = signJwt(user)

    // // set a cookie for the jwt
    // context.res.cookie('accessToken', token, {
    //   maxAge: 3.154e10, // 1 year
    //   httpOnly: true,
    //   domain: 'localhost',
    //   path: '/',
    //   sameSite: 'strict',
    //   secure: process.env.NODE_ENV === 'production',
    // })

    // return the jwt
    return token
  }
}
