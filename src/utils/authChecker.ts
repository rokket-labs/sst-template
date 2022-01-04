import { AuthChecker } from 'type-graphql'

import { Roles } from 'src/schema/user/user.schema'
import Context from 'src/types/context'

const authChecker: AuthChecker<Context, Roles> = async ({ context }, roles) => {
  const { user } = context.context

  if (!user) return false

  // If no roles are specified on @Authorized() or if the user is an admin, return true
  if (roles.length === 0 || user.roles.includes(Roles.ADMIN)) return true

  // If one of the specified roles matches, return true
  if (user.roles.some(role => roles.includes(role))) return true

  return false
}

export default authChecker
