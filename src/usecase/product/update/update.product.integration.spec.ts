import { Sequelize } from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import UpdateProductUseCase from './update.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import CreateProductUseCase from '../create/create.product.usecase';
import ProductInterface from '../../../domain/product/entity/product.interface';
import Product from '../../../domain/product/entity/product';

describe('Test update product integration', () => {
  let sequelize: Sequelize;
  let productCreated: ProductInterface;

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

  beforeEach(async () => {
    const productRepository = new ProductRepository();
    const useCaseCreate = new CreateProductUseCase(productRepository);
    const output = await useCaseCreate.execute({
      name: 'Product 1',
      price: 100,
    });
    productCreated = new Product(output.id, output.name, output.price);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should update a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: productCreated.id,
      name: 'Product UPDATED',
      price: 200,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });
  });

  it('should throw an error when name is empty', async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: productCreated.id,
      name: '',
      price: productCreated.price,
    };

    await expect(() => usecase.execute(input)).rejects.toThrow(
      'Name is required'
    );
  });

  it('should throw an error when price lower than zero', async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: productCreated.id,
      name: productCreated.name,
      price: -1,
    };

    await expect(() => usecase.execute(input)).rejects.toThrow(
      'Price must be greater than or equal zero'
    );
  });
});
