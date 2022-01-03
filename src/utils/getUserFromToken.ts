import { AuthenticationError } from 'apollo-server-lambda'

import { User, UserModel } from 'src/schema/user/user.schema'

import { decodeJwt } from './jwt'

export const getUserFromToken = async (token: string) => {
  const decoded = decodeJwt<User>(token)

  const user = await UserModel.find()
    .findBySub(decoded?.sub ?? '')
    .orFail(new AuthenticationError('User not found'))
    .lean()

  return user
}
