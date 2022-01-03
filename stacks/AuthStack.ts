import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { App, Auth, Stack, StackProps } from '@serverless-stack/resources'

export class AuthStack extends Stack {
  public readonly auth: Auth

  constructor(scope: App, index: string, props?: StackProps) {
    super(scope, index, props)

    this.auth = new Auth(this, index, {
      cognito: {
        triggers: {
          postConfirmation: {
            handler: 'src/functions/postConfirmation.handler',
            environment: {
              MONGODB_URI: process.env.MONGODB_URI ?? '',
            },
          },
        },
        userPool: {
          signInAliases: {
            email: true,
          },
        },
        userPoolClient: {
          authFlows: {
            userPassword: true,
          },
        },
      },
      // facebook: { appId: '419718329085014' },
      // apple: { servicesId: 'com.myapp.client' },
      // amazon: { appId: 'amzn1.application.24ebe4ee4aef41e5acff038aee2ee65f' },
      // google: {
      //   clientId:
      //     '38017095028-abcdjaaaidbgt3kfhuoh3n5ts08vodt3.apps.googleusercontent.com',
      // },
    })

    this.auth.attachPermissionsForAuthUsers([
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:*'],
        resources: ['*'],
      }),
    ])

    this.auth.attachPermissionsForUnauthUsers([
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:GetObject'],
        resources: ['*'],
      }),
    ])

    this.addOutputs({
      cognitoUserPool: this.auth.cognitoUserPool?.userPoolId ?? '',
      cognitoUserPoolArn: this.auth.cognitoUserPool?.userPoolArn ?? '',
      cognitoIdentityPool: this.auth.cognitoIdentityPoolId,
      cognitoUserPoolClient:
        this.auth.cognitoUserPoolClient?.userPoolClientId ?? '',
    })
  }
}
