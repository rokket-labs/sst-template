import { CreateUserInput, UpdateUserInput } from 'src/schema/user/user.dto'
import { UserModel } from 'src/schema/user/user.schema'

export default class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input)
  }

  async updateUser(input: UpdateUserInput) {
    const { email, ...rest } = input

    return UserModel.findOneAndUpdate({ email }, rest, { new: true }).lean()
  }
}
