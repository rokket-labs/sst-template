import * as sst from '@serverless-stack/resources'

import { ApiStack } from './ApiStack'
import { AuthStack } from './AuthStack'
import { StorageStack } from './StorageStack'

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
    bundle: {
      esbuildConfig: {
        plugins: 'config/esbuild.js',
      },
    },
  })

  const authStack = new AuthStack(app, 'Auth')

  new ApiStack(app, 'Api', { auth: authStack.auth })

  new StorageStack(app, 'Storage')
}
