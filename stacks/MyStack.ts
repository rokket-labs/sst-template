import * as sst from '@serverless-stack/resources'

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    const api = new sst.ApolloApi(this, 'Apollo', {
      server: {
        handler: 'src/graphql.handler',
        bundle: {
          esbuildConfig: {
            plugins: 'config/esbuild.ts',
          },
        },
      },
    })

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    })
  }
}
