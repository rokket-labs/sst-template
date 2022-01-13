import { App } from '@serverless-stack/resources'
import { SSM } from 'aws-sdk'

type GetParameterByEnvOrNameProps = {
  app: App
  parameters: Record<string, string | undefined>
  env: string
  key: string
}

export const getParameters = async (app: App) => {
  const ssm = new SSM({ region: app.region })

  const { Parameters } = await ssm
    .getParametersByPath({
      Path: `/${app.name}/${app.stage}`,
      Recursive: true,
    })
    .promise()

  if (!Parameters) return {}

  const params: Record<string, string | undefined> = {}

  for (const param of Parameters)
    if (param.Name) params[param.Name] = param.Value

  return params
}

export const getParameterByEnvOrName = ({
  app,
  parameters,
  env,
  key,
}: GetParameterByEnvOrNameProps) =>
  process.env[env] ?? parameters[`/${app.name}/${app.stage}/${key}`] ?? ''
