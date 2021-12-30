import {
  CreateProductInput,
  GetProductInput,
} from 'src/schema/product/product.dto'
import { ProductModel } from 'src/schema/product/product.schema'
import { User } from 'src/schema/user/user.schema'

class ProductService {
  async createProduct(input: CreateProductInput & { user: User['_id'] }) {
    return ProductModel.create(input)
  }

  async findProducts() {
    // Pagination login
    return ProductModel.find().lean()
  }

  async findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean()
  }
}

export default ProductService
