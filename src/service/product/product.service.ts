import {
  CreateProductInput,
  GetProductInput,
} from 'src/schema/product/product.dto'
import { ProductModel } from 'src/schema/product/product.schema'
import { User } from 'src/schema/user/user.schema'
import { PaginatedInputOptions } from 'src/utils/schemas/PaginatedOptions.dto'

class ProductService {
  async createProduct(input: CreateProductInput & { user: User['_id'] }) {
    return ProductModel.create(input)
  }

  async findProducts(paginatedOptions: PaginatedInputOptions) {
    // You can add a normal Mongo query on the first parameter
    return ProductModel.paginate({}, paginatedOptions)
  }

  async findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean()
  }
}

export default ProductService
