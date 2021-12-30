import { IsNumber, MaxLength, Min, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateProductInput {
  @Field()
  name: string

  @MinLength(50, {
    message: 'Description must be at least 50 characters',
  })
  @MaxLength(1000, {
    message: 'Description must not be more than 1000 characters',
  })
  @Field()
  description: string

  @IsNumber()
  @Min(1)
  @Field()
  price: number
}

@InputType()
export class GetProductInput {
  @Field()
  productId: string
}
