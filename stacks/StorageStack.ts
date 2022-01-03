import { RemovalPolicy } from '@aws-cdk/core'
import { App, Bucket, Stack, StackProps } from '@serverless-stack/resources'

export class StorageStack extends Stack {
  constructor(scope: App, index: string, props?: StackProps) {
    super(scope, index, props)

    const bucket = new Bucket(this, index, {
      s3Bucket: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
    })

    this.addOutputs({
      bucketArn: bucket.bucketArn,
    })
  }
}
