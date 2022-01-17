import path from 'path'

import { App, Bucket, Stack, StackProps } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'

export class EmailStack extends Stack {
  public readonly bucket: Bucket

  constructor(scope: App, index: string, props?: StackProps) {
    super(scope, index, props)

    this.bucket = new Bucket(this, index, {
      s3Bucket: {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    })

    new BucketDeployment(this, 'UploadEmailTemplates', {
      sources: [Source.asset(path.join(__dirname, '../../src/email'))],
      destinationBucket: this.bucket.s3Bucket,
    })

    this.addOutputs({
      emailTemplatesBucketName: this.bucket.bucketName,
    })
  }
}
