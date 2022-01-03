# Rokket Labs' SST Template

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

## Features

- [x] Rokket Labs code configuration
- [x] Serverless Stack (SST)
- [x] Cognito Authentication (with post confirmation handlers)
- [x] S3 Bucket configuration and permissions
- [x] Apollo GraphQL with Code First approach (TypeGraphQL)
- [x] MongoDB with Typegoose
- [] RBAC Authorization examples with Oso
- [] SES Configuration
- [x] Pagination model examples
- [] Jest test environment

Start by installing the dependencies.

```bash
$ yarn
```

## Commands

### `yarn run start`

Starts the local Lambda development environment.

### `yarn run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `yarn run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy a specific stack.

### `yarn run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally remove a specific stack.

### `yarn run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

### Notes

- Make sure you set the app name on `sst.json` as this will be used to create every AWS resource name as a prefix.

- If you need to connect your API to a different Cognito User Pool, add the following environment variables to your setup with their respective IDs: `COGNITO_USER_POOL` and `COGNITO_USER_POOL_CLIENT`.

- Make sure every entrypoint for your stack (every function called either by API Gateway or through an external trigger) includes `import 'reflect-metadata'` at the top of your file, since this app relies heavily on the use of decorators.

- A generic class with pagination options is included on `src/utils/schemas/PaginatedModel.ts`. In order to use this, create a new class that extends from this model and make sure you include the `docs` property, which should be an array of your specific model.

- By default, all endpoints are protected by Cognito JWT authentication. If there's a need for a public GraphQL endpoint, either create a second function which has no auth included, or move authentication to the `src/utils/authChecker.ts` file. Authentication is not necessary for local development, but it is enforced once functions are deployed.

- All entrypoint files (functions) should be set on `src/functions`.

- Make sure you have AWS credentials set on your local computer. They should be on `~/.aws/credentials`, under the `default` selector. If you have more than one profile on your computer, run `export AWS_PROFILE=<your-profile-name>` before running any commands on this repository.

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).
