import 'reflect-metadata'

import { ApolloServer, AuthenticationError } from 'apollo-server-lambda'
import { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda'
import { buildSchema } from 'type-graphql'

import { resolvers } from 'src/resolvers'
import authChecker from 'src/utils/authChecker'
import { getUserFromToken } from 'src/utils/getUserFromToken'
import { dbConnect } from 'src/utils/mongo'

const IS_LOCAL = !!process.env.IS_LOCAL

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  context.callbackWaitsForEmptyEventLoop = false

  const schema = await buildSchema({
    resolvers,
    authChecker,
    emitSchemaFile: IS_LOCAL,
  })

  const server = new ApolloServer({
    context: async ctx => {
      const token = ctx.express.req.headers.authorization

      if (!token)
        throw new AuthenticationError('You must be logged in to access')

      const user = await getUserFromToken(token)

      ctx.context.user = user

      return ctx
    },
    introspection: IS_LOCAL,
    schema,
  })

  await dbConnect()

  return server.createHandler()(event, context, callback)
}
