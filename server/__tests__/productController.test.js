/* eslint-disable no-console */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Product = require('../models/product');
const productController = require('../controllers/productController');
const genreController = require('../controllers/genreController');
const typeController = require('../controllers/typeController');
const validateProduct = require('../validators/productValidator');

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

describe('get_by_type', () => {
  test('should retrieve an array of products by a given type, sorted by name', async () => {
    const req = { typeId: 'mockTypeId' };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockResult = [{ name: 'product1' }, { name: 'product2' }];

    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockResult),
    });

    await productController.get_by_type(req, res);

    expect(Product.find).toHaveBeenCalledWith({ 'type._id': req.typeId });
    expect(res.send).toHaveBeenCalledWith(mockResult);
  });

  test('should log and send the error if an error occurs', async () => {
    const req = { typeId: 'mockTypeId' };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Product.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await productController.get_by_type(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('get_by_type_and_genre', () => {
  test('should retrieve an array of products which match a given type and genre, sorted by name', async () => {
    const req = { genreId: 'mockGenreId', typeId: 'mockTypeId' };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockResult = [{ name: 'product1' }, { name: 'product2' }];

    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockResult),
    });

    await productController.get_by_type_and_genre(req, res);

    expect(Product.find).toHaveBeenCalledWith(
      {
        $and: [{
          genres: { $elemMatch: { _id: req.genreId } },
          'type._id': req.typeId,
        }],
      },
    );
    expect(res.send).toHaveBeenCalledWith(mockResult);
  });

  test('should log and send the error if an error occurs', async () => {
    const req = { genreId: 'mockGenreId', typeId: 'mockTypeId' };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Product.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await productController.get_by_type_and_genre(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('post_product', () => {
  jest.mock('mongoose');
  jest.mock('../controllers/genre');
  jest.mock('../controllers/type');
  jest.mock('../validators/productValidator');

  let req;
  let res;
  let session;

  beforeEach(() => {
    req = {
      body: {
        name: 'Product1',
        description: 'A sample product',
        price: 100,
        number_in_stock: 10,
        genres: 'Genre1,Genre2',
        type: 'Type1',
      },
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnValue(),
    };
    session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // mock session creation
    mongoose.startTransaction.mockResolvedValue(session);

    // mock product validation
    validateProduct.mockReturnValue({ err: null });

    // mock genre controller
    genreController.get_id.mockResolvedValue('mockGenreId');
    genreController.add_product.mockResolvedValue({});

    // mock type controller
    typeController.get_id.mockResolvedValue('mockTypeId');
    typeController.add_product.mockResolvedValue({});

    // mock product save
    Product.save.mockResolvedValue({
      _id: 'mockProductId',
      genres: [{ _id: 'mockGenreId', name: 'genre1' }],
      type: { _id: 'mockTypeId', name: 'type1' },
    });
  });

  test('should validate the input and return a 400 error if validation fails', async () => {
    validateProduct.mockReturnValue({ err: 'Validation error' });

    await productController.post_product(req, res);

    expect(validateProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ err: 'Validation Error' });
  });
});

describe('put_edit_product', () => {});

describe('put_update_stock', () => {});

describe('delete_product', () => {});
