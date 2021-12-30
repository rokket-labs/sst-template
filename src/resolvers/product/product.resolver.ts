import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import {
  CreateProductInput,
  GetProductInput,
} from '../../schema/product/product.dto'
import { Product } from '../../schema/product/product.schema'
import ProductService from '../../service/product/product.service'
import Context from '../../types/context'

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {}

  @Authorized()
  @Mutation(() => Product)
  createProduct(
    @Arg('input') input: CreateProductInput,
    @Ctx() context: Context,
  ) {
    const { user } = context

    if (!user) throw new Error('no user')

    return this.productService.createProduct({ ...input, user: user?._id })
  }

  @Query(() => [Product])
  products() {
    return this.productService.findProducts()
  }

  @Query(() => Product)
  product(@Arg('input') input: GetProductInput) {
    return this.productService.findSingleProduct(input)
  }
}
