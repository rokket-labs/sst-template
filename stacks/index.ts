import * as sst from '@serverless-stack/resources'

import MyStack from './MyStack'

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
    environment: {
      MONGODB_URI: process.env.MONGODB_URI ?? '',
    },
  })

  new MyStack(app, 'rokket-labs-stack')

  // Add more stacks
}
