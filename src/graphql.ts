import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda'
import { buildSchema } from 'type-graphql'

import 'reflect-metadata'

import { User } from './schema/user/user.schema'
import authChecker from './utils/authChecker'
import { verifyJwt } from './utils/jwt'
import dbConnect from './utils/mongo'
import { resolvers } from './resolvers'

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
    emitSchemaFile: true,
  })

  const server = new ApolloServer({
    context: ctx => {
      const token = ctx.express.req.headers.authorization

      if (token) {
        const user = verifyJwt<User>(token)

        ctx.context.user = user
      }

      return ctx
    },
    introspection: IS_LOCAL,
    schema,
  })

  await dbConnect()

  return server.createHandler()(event, context, callback)
}
