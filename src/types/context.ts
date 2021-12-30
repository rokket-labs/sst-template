import { LambdaContextFunctionParams } from 'apollo-server-lambda/dist/ApolloServer'

import { User } from '../schema/user/user.schema'

interface Context extends LambdaContextFunctionParams {
  context: {
    user: User | null
  }
}

export default Context
