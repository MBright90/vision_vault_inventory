/* eslint-disable no-console */
/* eslint-disable no-undef */
const Product = require('../models/product');
const productController = require('../controllers/productController');

jest.mock('../models/product');

describe('get_all', () => {
  test('should retrieve all products sorted by name', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockProducts = [{ name: 'product1' }, { name: 'product2' }];

    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockProducts),
    });

    await productController.get_all(req, res);

    expect(Product.find).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockProducts);
  });

  test('should log and send the error if an error occurs', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Product.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await productController.get_all(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('get_by_id', () => {
  test('should retrieve a product by a given id', async () => {
    const req = { params: { id: 'mockId' } };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnValue,
    };
    const mockProduct = { name: 'mockProduct' };

    Product.findById.mockResolvedValue(mockProduct);

    await productController.get_by_id(req, res);

    expect(Product.findById).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockProduct);
  });

  test('should log and send the error if an error occurs', async () => {
    const req = { params: { id: 'mockId' } };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Product.findById.mockRejectedValue(mockError);

    await productController.get_by_id(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('get_by_genre', () => {
  test('should retrieve an array of products by a given genre, sorted by name', async () => {
    const req = { params: { genreId: 'mockGenreId' } };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockResult = [{ name: 'product1' }, { name: 'product2' }];

    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockResult),
    });

    await productController.get_by_genre(req, res);

    expect(Product.find).toHaveBeenCalledWith(
      { genres: { $elemMatch: { _id: 'mockGenreId' } } },
    );
    expect(res.send).toHaveBeenCalledWith(mockResult);
  });

  test('should log and send the error if an error occurs', async () => {
    const req = { params: { genreId: 'mockGenreId' } };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Product.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await productController.get_by_genre(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('get_by_type', () => {});

describe('get_by_type_and_genre', () => {});

describe('post_product', () => {});

describe('put_edit_product', () => {});

describe('put_update_stock', () => {});

describe('delete_product', () => {});
