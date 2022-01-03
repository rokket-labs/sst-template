import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers'
import { UserPool, UserPoolClient } from '@aws-cdk/aws-cognito'
import {
  ApiAuthorizationType,
  ApolloApi,
  App,
  Auth,
  Bucket,
  Stack,
  StackProps,
} from '@serverless-stack/resources'

interface ApiStackProps extends StackProps {
  readonly auth: Auth
  readonly bucket: Bucket
}

export class ApiStack extends Stack {
  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const isLocal = scope.local
    const { auth, bucket } = props

    let importedUserPool
    let importedUserPoolClient

    // Import existing Cognito User Pools if added to local env
    if (
      isLocal &&
      process.env.COGNITO_USER_POOL &&
      process.env.COGNITO_USER_POOL_CLIENT
    ) {
      importedUserPool = UserPool.fromUserPoolId(
        this,
        'imported-user-pool',
        process.env.COGNITO_USER_POOL,
      )
      importedUserPoolClient = UserPoolClient.fromUserPoolClientId(
        this,
        'imported-user-pool-client',
        process.env.COGNITO_USER_POOL_CLIENT,
      )
    }

    // Only create Cognito authorizers if a valid auth stack is passed
    const cognitoAuthorizer = auth.cognitoUserPool &&
      auth.cognitoUserPoolClient && {
        defaultAuthorizationType: ApiAuthorizationType.JWT,
        defaultAuthorizer: new HttpUserPoolAuthorizer({
          userPool: importedUserPool || auth.cognitoUserPool,
          userPoolClients: [
            importedUserPoolClient || auth.cognitoUserPoolClient,
          ],
        }),
      }

    // Create the API instance
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

    // Attach all permissions needed for the APIs
    api.attachPermissions([bucket])

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: `${api.url}/graphql`,
    })
  }
}
