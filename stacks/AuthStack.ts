import {
  App,
  Auth,
  Bucket,
  Stack,
  StackProps,
} from '@serverless-stack/resources'
import { UserPoolEmail } from 'aws-cdk-lib/aws-cognito'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

interface AuthStackProps extends StackProps {
  readonly bucket: Bucket
  readonly parameters: Record<string, string | undefined>
}

export class AuthStack extends Stack {
  public readonly auth: Auth

  constructor(scope: App, index: string, props?: AuthStackProps) {
    super(scope, index, props)

    const productionEmailAddress =
      props?.parameters[`/${scope.name}/${scope.stage}/email-address`] ?? ''

    this.auth = new Auth(this, index, {
      cognito: {
        triggers: {
          // Add users to our MongoDB users' collection after they confirm their accounts
          postConfirmation: {
            handler: 'src/functions/postConfirmation.handler',
            environment: {
              MONGODB_URI: process.env.MONGODB_URI ?? '',
            },
          },
          // Send custom HTML email messages for code verification and password recovery
          customMessage: 'src/functions/customMessage.handler',
        },
        userPool: {
          selfSignUpEnabled: true,
          signInAliases: {
            email: true,
          },
          /*
           * IMPORTANT: If your code is on production, ALWAYS send email through SES instead of Cognito.
           * To do this, configure an email address on SES, move SES out of sandbox mode and add the address to
           * an SSM Parameter variable with the key /<app-name>/production/email-address
           */
          ...(scope.stage === 'production' && {
            email: UserPoolEmail.withSES({
              fromEmail: productionEmailAddress,
              fromName: 'Rokket Labs',
            }),
          }),
        },
        userPoolClient: {
          authFlows: {
            userPassword: true,
          },
        },
      },
      /*
       * Add all social providers needed for your application
       * NOTE: Use SSM parameters instead of hardcoded strings
       */
      // facebook: { appId: '419718329085014' },
      // apple: { servicesId: 'com.myapp.client' },
      // amazon: { appId: 'amzn1.application.24ebe4ee4aef41e5acff038aee2ee65f' },
      // google: {
      //   clientId:
      //     '38017095028-abcdjaaaidbgt3kfhuoh3n5ts08vodt3.apps.googleusercontent.com',
      // },
    })

    if (props?.bucket) {
      this.auth.attachPermissionsForAuthUsers([
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:*'],
          resources: [props.bucket.bucketArn],
        }),
      ])

      this.auth.attachPermissionsForUnauthUsers([
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:GetObject'],
          resources: [props.bucket.bucketArn],
        }),
      ])
    }

    this.addOutputs({
      cognitoUserPool: this.auth.cognitoUserPool?.userPoolId ?? '',
      cognitoUserPoolArn: this.auth.cognitoUserPool?.userPoolArn ?? '',
      cognitoIdentityPool: this.auth.cognitoIdentityPoolId,
      cognitoUserPoolClient:
        this.auth.cognitoUserPoolClient?.userPoolClientId ?? '',
    })
  }
}
