import { CustomMessageTriggerHandler } from 'aws-lambda'
import { minify } from 'html-minifier'

import userForgotPassword from 'src/email/userForgotPassword.html'
import userVerification from 'src/email/userVerification.html'

const minifyHtml = (file: string, populate: Record<string, string>) => {
  for (const [key, value] of Object.entries(populate))
    file = file.replace(key, value)

  return minify(file, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
  })
}

export const handler: CustomMessageTriggerHandler = (
  event,
  context,
  callback,
) => {
  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = 'Confirm your account - Rokket Labs'
    event.response.emailMessage = minifyHtml(userVerification, {
      '{####}': event.request.codeParameter,
    })
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Password Recovery - Rokket Labs'
    event.response.emailMessage = minifyHtml(userForgotPassword, {
      '{####}': event.request.codeParameter,
    })
  }

  callback(null, event)
}
