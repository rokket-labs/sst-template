import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda'
import { buildSchema } from 'type-graphql'

import 'reflect-metadata'

import authChecker from './utils/authChecker'
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
      // console.log(ctx)

      return ctx
    },
    introspection: IS_LOCAL,
    schema,
  })

  await dbConnect()

  return server.createHandler()(event, context, callback)
}
