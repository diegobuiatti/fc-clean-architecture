import { Sequelize } from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import Product from '../../../domain/product/entity/product';
import FindProductUseCase from './find.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';

describe('Test find product interface', () => {
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

  it('should find a product', async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    const product = new Product('1', 'Product 1', 100);

    await productRepository.create(product);

    const input = {
      id: '1',
    };

    const output = {
      id: '1',
      name: 'Product 1',
      price: 100,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it('should throw an error when product is not found', async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: '1',
    };

     await expect(() => usecase.execute(input)).rejects.toThrow(
       'Product not found'
     );
  });
});
