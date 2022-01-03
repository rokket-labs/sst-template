import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import {
  CreateProductInput,
  GetProductInput,
} from 'src/schema/product/product.dto'
import { PaginatedProducts, Product } from 'src/schema/product/product.schema'
import ProductService from 'src/service/product/product.service'
import Context from 'src/types/context'
import { PaginatedInputOptions } from 'src/utils/schemas/PaginatedOptions.dto'

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService()
  }

  @Authorized()
  @Mutation(() => Product)
  createProduct(@Arg('input') input: CreateProductInput, @Ctx() ctx: Context) {
    const { user } = ctx.context

    if (!user) throw new Error('No user')

    return this.productService.createProduct({ ...input, user: user?._id })
  }

  @Query(() => PaginatedProducts)
  products(@Arg('pagination') options: PaginatedInputOptions) {
    return this.productService.findProducts(options)
  }

  @Query(() => Product)
  product(@Arg('input') input: GetProductInput) {
    return this.productService.findSingleProduct(input)
  }
}
