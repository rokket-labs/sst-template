/* eslint-disable simple-import-sort/imports */
import 'reflect-metadata'
import path from 'path'

import { ApolloServer } from 'apollo-server-lambda'
import { buildSchema } from 'type-graphql'

// import { buildSchema } from 'type-graphql'

import authChecker from './utils/authChecker'
// import UserResolver from './resolvers/user/user.resolver'
// import { User } from './schema/user/user.schema'
// import authChecker from './utils/authChecker'
// import { verifyJwt } from './utils/jwt'
import dbConnect from './utils/mongo'
import { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda'
// // import { resolvers } from './resolvers'

const IS_LOCAL = !!process.env.IS_LOCAL

// const bootstrap = async () => {
//   const typeDefs = gql`
//     type Query {
//       hello: String
//     }
//   `

//   // Provide resolver functions for your schema fields
//   const resolvers = {
//     Query: {
//       hello: () => 'Hello world!',
//     },
//   }

//   // const schema = await buildSchema({
//   //   resolvers: [UserResolver],
//   // })

//   // console.log(schema)

//   const server = new ApolloServer({
//     // context: ({ express }) => {
//     //   const token = express.req.headers.authorization ?? ''

//     //   if (token) {
//     //     const user = verifyJwt<User>(token)

//     //     return { user }
//     //   }
//     // },
//     typeDefs,
//     resolvers,
//     introspection: IS_LOCAL,
//   })

//   console.log(server)

//   return server.createHandler

//   // try {
//   //   await dbConnect
//   //   console.log('Connected to Database')

//   //   return server.createHandler()
//   // } catch (error) {
//   //   console.error(error)

//   //   throw new Error(JSON.stringify(error))
//   // }
// }

// const schema = await buildSchema({
//   resolvers: [UserResolver],
// })

// // console.log(schema)

// const server = new ApolloServer({
//   // context: ({ express }) => {
//   //   const token = express.req.headers.authorization ?? ''

//   //   if (token) {
//   //     const user = verifyJwt<User>(token)

//   //     return { user }
//   //   }
//   // },
//   schema,
//   introspection: IS_LOCAL,
// })

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  console.log('here')

  await dbConnect

  console.log('connected to mongo')

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, '/**/*.resolver.ts')],
    authChecker,
    emitSchemaFile: true,
  })

  console.log(schema)

  const server = new ApolloServer({
    schema,
    introspection: IS_LOCAL,
  })

  return server.createHandler()(event, context, callback)
}
