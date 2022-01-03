import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers'
import {
  ApiAuthorizationType,
  ApolloApi,
  App,
  Auth,
  Stack,
  StackProps,
} from '@serverless-stack/resources'

interface ApiStackProps extends StackProps {
  readonly auth: Auth
}

export class ApiStack extends Stack {
  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const isLocal = false
    const { auth } = props

    const cognitoAuthorizer = auth.cognitoUserPool &&
      auth.cognitoUserPoolClient && {
        defaultAuthorizationType: ApiAuthorizationType.JWT,
        defaultAuthorizer: new HttpUserPoolAuthorizer({
          userPool: auth.cognitoUserPool,
          userPoolClients: [auth.cognitoUserPoolClient],
        }),
      }

    const api = new ApolloApi(this, 'Apollo', {
      ...(!isLocal && cognitoAuthorizer),
      server: {
        handler: 'src/functions/graphql.handler',
        environment: {
          MONGODB_URI: process.env.MONGODB_URI ?? '',
        },
      },
      rootPath: '/graphql',
    })

    api.attachPermissions(['s3'])

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: `${api.url}/graphql`,
    })
  }
}
