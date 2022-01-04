import { AuthChecker } from 'type-graphql'

import Context from 'src/types/context'

const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  // console.log({ roles, user: context.context.user })

  return !!context.context.user
}

export default authChecker
