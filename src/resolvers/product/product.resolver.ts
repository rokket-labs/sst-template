import { ObjectId } from 'mongodb'
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import {
  CreateProductInput,
  GetProductInput,
} from 'src/schema/product/product.dto'
import { PaginatedProducts, Product } from 'src/schema/product/product.schema'
import { Roles, UserModel } from 'src/schema/user/user.schema'
import ProductService from 'src/service/product/product.service'
import Context from 'src/types/context'
import { PaginatedInputOptions } from 'src/utils/schemas/PaginatedOptions.dto'

@Resolver(Product)
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService()
  }

  @Query(() => PaginatedProducts)
  products(
    @Arg('pagination', { nullable: true }) options: PaginatedInputOptions,
  ) {
    return this.productService.findProducts(options)
  }

  @Query(() => Product, { nullable: true })
  product(@Arg('input') input: GetProductInput) {
    return this.productService.findSingleProduct(input)
  }

  @Authorized<Roles>(Roles.MAINTAINER)
  @Mutation(() => Product)
  createProduct(@Arg('input') input: CreateProductInput, @Ctx() ctx: Context) {
    const { user } = ctx.context

    if (!user) throw new Error('No user')

    return this.productService.createProduct({ ...input, user: user?._id })
  }

  @Authorized<Roles>(Roles.ADMIN)
  @Mutation(() => Product)
  deleteProduct(@Arg('id') id: string) {
    return this.productService.deleteProduct(id)
  }

  @FieldResolver()
  async user(@Root() product: Product) {
    if (product.user instanceof ObjectId)
      return UserModel.findById(product.user.toString())

    return UserModel.findById(product.user)
  }
}
