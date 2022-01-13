import { App } from '@serverless-stack/resources'

import { ApiStack } from './ApiStack'
import { AuthStack } from './AuthStack'
import { getParameters } from './SSM'
import { StorageStack } from './StorageStack'

export default async function main(app: App): Promise<void> {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
    bundle: {
      esbuildConfig: {
        plugins: 'config/esbuild.js',
      },
      loader: {
        '.html': 'text',
      },
      externalModules: ['aws-sdk'],
      nodeModules: ['uglify-js'],
    },
  })

  // Get SSM Values
  const parameters = await getParameters(app)

  const storageStack = new StorageStack(app, 'Storage')

  const authStack = new AuthStack(app, 'Auth', {
    bucket: storageStack.bucket,
    parameters,
  })

  new ApiStack(app, 'Api', {
    auth: authStack.auth,
    bucket: storageStack.bucket,
    parameters,
  })
}
