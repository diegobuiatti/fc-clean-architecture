import CreateProductUseCase from './create.product.usecase';

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  };
};

describe('Test create product use case', () => {
  it('should create a product', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: 'Product 1',
      price: 100,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it('should throw an error when name is empty', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: '',
      price: 100,
    };

    expect(() => usecase.execute(input)).rejects.toThrow('Name is required');
  });

  it('should throw an error when price is empty', async () => {
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: 'Product 1',
      price: -1,
    };

    expect(() => usecase.execute(input)).rejects.toThrow(
      'Price must be greater than or equal zero'
    );
  });
});
