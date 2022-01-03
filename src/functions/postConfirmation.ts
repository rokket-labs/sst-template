import 'reflect-metadata'

import { PostConfirmationTriggerHandler } from 'aws-lambda'

import UserService from 'src/service/user/user.service'
import { dbConnect } from 'src/utils/mongo'

export const handler: PostConfirmationTriggerHandler = async (
  event,
  context,
  callback,
) => {
  try {
    await dbConnect()

    const userService = new UserService()
    const { userAttributes } = event.request

    await userService.createUser({
      email: userAttributes.email,
      sub: userAttributes.sub,
    })

    callback(null, event)
  } catch (err) {
    console.error(err as string)
    callback(err as Error)
  }
}
