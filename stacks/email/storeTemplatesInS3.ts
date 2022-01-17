import { readFileSync } from 'fs'
import path from 'path'

import { App } from '@serverless-stack/resources'
import { S3 } from 'aws-sdk'
import glob from 'glob'

export const storeTemplatesInS3 = async (app: App, bucketName: string) => {
  const s3 = new S3({ region: app.region })

  const files = glob.sync(path.join(__dirname, '../../src/**/*.hbs'))

  console.log(bucketName)

  for (const file of files) {
    const html = readFileSync(file)

    const response = await s3
      .putObject({
        Bucket: bucketName,
        Key: path.basename(file, '.hbs'),
        Body: html,
      })
      .promise()

    console.log(response)
  }
}
