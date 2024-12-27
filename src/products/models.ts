import { Meta } from "../shared/models";

export class Product {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly quantity: number;
  readonly meta: Meta;

  constructor(productId: string, name: string, price: number, description: string, quantity: number, meta: Meta) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.description = description;
    this.quantity = quantity;
    this.meta = meta;
  }

  fromJson(json: any): Product {
    return new Product(json.productId, json.name, json.price, json.description, json.quantity, Meta.fromJson(json.meta));
  }

  toJson(product: Product): any {
    return {
      productId: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      meta: Meta.toJson(product.meta)
    };
  }
}