import ProductResolver from './product/product.resolver'
import UserResolver from './user/user.resolver'

export const resolvers = [UserResolver, ProductResolver] as const
