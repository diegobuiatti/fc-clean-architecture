import { Sequelize } from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import CreateProductUseCase from './create.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductFactory from '../../../domain/product/factory/product.factory';

describe('Test create product integration', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: true,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const product = ProductFactory.create('Product 1', 100);

    await productRepository.create(product);

    const input = {
      name: 'Product 1',
      price: 100,
    };

    const output = {
      id: expect.any(String),
      name: 'Product 1',
      price: 100,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it('should throw an error when name is missing', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: '',
      price: 100,
    };

    await expect(usecase.execute(input)).rejects.toThrow('Name is required');
  });

  it('should throw an error when price lower then 0', async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: 'Product 1',
      price: -1,
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      'Price must be greater than or equal zero'
    );
  });
});
