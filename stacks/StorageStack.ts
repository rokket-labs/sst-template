import { RemovalPolicy } from '@aws-cdk/core'
import { App, Bucket, Stack, StackProps } from '@serverless-stack/resources'

export class StorageStack extends Stack {
  public readonly bucket: Bucket

  constructor(scope: App, index: string, props?: StackProps) {
    super(scope, index, props)

    this.bucket = new Bucket(this, index, {
      s3Bucket: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
    })

    this.addOutputs({
      bucketArn: this.bucket.bucketArn,
    })
  }
}
