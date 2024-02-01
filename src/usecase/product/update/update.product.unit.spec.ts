import Product from '../../../domain/product/entity/product';
import UpdateProductUseCase from './update.product.usecase';

const input = {
  id: '1',
  name: 'Product 1',
  price: 100,
}

const updatedProduct = {
  id: '1',
  name: 'Product UPDATED',
  price: 200,
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(new Product(input.id, input.name, input.price)),
    findAll: jest.fn(),
  };
};

describe('Test update product use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const output = await usecase.execute(updatedProduct);

    expect(output).toEqual({
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
    });
  });

  it('should throw an error when name is empty', async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      ...updatedProduct,
      name: ''
    };

    expect(() => usecase.execute(input)).rejects.toThrow('Name is required');
  });

  it('should throw an error when price lower than zero', async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      ...updatedProduct,
      price: -1,
    };

    expect(() => usecase.execute(input)).rejects.toThrow(
      'Price must be greater than or equal zero'
    );
  });
});
