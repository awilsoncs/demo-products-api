import { Product } from '../../../src/products/models';
import { Meta } from '../../../src/shared/models';

describe('Product model', () => {
  const meta = new Meta('system', new Date(), 'system', new Date());
  const product = new Product('123', 'Test Product', 100, 'Test Description', 10, meta);

  it('should create a Product instance', () => {
    expect(product).toBeInstanceOf(Product);
    expect(product.productId).toBe('123');
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(100);
    expect(product.description).toBe('Test Description');
    expect(product.quantity).toBe(10);
    expect(product.meta).toBe(meta);
  });

  it('should convert Product to JSON', () => {
    const json = product.toJson(product);
    expect(json).toEqual({
      productId: '123',
      name: 'Test Product',
      price: 100,
      description: 'Test Description',
      quantity: 10,
      meta: Meta.toJson(meta),
    });
  });

  it('should create Product from JSON', () => {
    const json = {
      productId: '123',
      name: 'Test Product',
      price: 100,
      description: 'Test Description',
      quantity: 10,
      meta: Meta.toJson(meta),
    };
    const newProduct = product.fromJson(json);
    expect(newProduct).toBeInstanceOf(Product);
    expect(newProduct.productId).toBe('123');
    expect(newProduct.name).toBe('Test Product');
    expect(newProduct.price).toBe(100);
    expect(newProduct.description).toBe('Test Description');
    expect(newProduct.quantity).toBe(10);
    expect(newProduct.meta).toEqual(meta);
  });
});