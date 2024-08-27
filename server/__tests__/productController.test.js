/* eslint-disable no-console */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Product = require('../models/product');
const productController = require('../controllers/productController');
const genreController = require('../controllers/genreController');
const typeController = require('../controllers/typeController');
const validateProduct = require('../validators/productValidator');

jest.mock('../models/product');
console.log = jest.fn();

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
        genres: 'genre1, genre2',
        type: 'type1',
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
    Product.prototype.save.mockResolvedValue({
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

  test('should start a transaction, save the product, and commit the transaction', async () => {
    await productController.post_product(req, res);

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.startTransaction).toHaveBeenCalled();
    expect(Product.save).toHaveBeenCalledWith({ session });
    expect(session.commitTransaction).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'mockProductId',
    }));
  });

  test('should call genreController.get_id and typeController.get_id with the correct parameters', async () => {
    await productController.post_product(req, res);

    expect(genreController.get_id).toHaveBeenCalledWith('genre1', session);
    expect(typeController.get_id).toHaveBeenCalledWith('type1', session);
  });

  test('should call genreController.add_product and typeController.add_product after saving the product', async () => {
    await productController.post_product(req, res);

    expect(genreController.get_id).toHaveBeenCalledWith('mockGenreId', 'mockProductId', session);
    expect(typeController.get_id).toHaveBeenCalledWith('mockTypeId', 'mockProductId', session);
  });

  test('should abort the transaction and return a 500 error if an error occurs', async () => {
    Product.prototype.save.mockRejectedValue(new Error('Saving error'));

    expect(session.abortTransaction).toHaveBeenCalled();
    expect(session.endTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('put_edit_product', () => {
  jest.mock('mongoose');
  jest.mock('../controllers/genre');
  jest.mock('../controllers/type');
  jest.mock('../validators/productValidator');

  let req;
  let res;
  let session;

  beforeEach(() => {
    req = {
      params: { id: 'mockProductId' },
      body: {
        name: 'Product1',
        description: 'A sample product',
        price: 100,
        number_in_stock: 10,
        genres: 'genre1, genre2',
        prevGenres: ['prevGenre1', 'prevGenre2'],
        type: 'type1',
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
    genreController.remove_product.mockResolvedValue({});

    // mock type controller
    typeController.get_id.mockResolvedValue('mockTypeId');
    typeController.add_product.mockResolvedValue({});
    typeController.remove_product.mockResolvedValue({});

    // mock product save
    Product.findOneAndUpdate = jest.fn().mockResolvedValue({
      _id: 'mockProductId',
      genres: [{ _id: 'mockGenreId', name: 'genre1' }],
      type: { _id: 'mockTypeId', name: 'type1' },
    });
  });

  test('should validate the input and return a 400 error if validation fails', async () => {
    validateProduct.mockReturnValue({ err: 'Validation error' });

    await productController.put_edit_product(req, res);

    expect(validateProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ err: 'Validation Error' });
  });

  test('should start a transaction, update the product, and commit the transaction', async () => {
    await productController.put_edit_product(req, res);

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.startTransaction).toHaveBeenCalled();
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'mockProductId' },
      expect.any(Object),
      { upsert: true, new: true, session },
    );
    expect(session.commitTransaction).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  test('should call genreController.get_id and typeController.get_id with the correct parameters', async () => {
    await productController.put_edit_product(req, res);

    expect(genreController.get_id).toHaveBeenCalledWith('genre1', session);
    expect(typeController.get_id).toHaveBeenCalledWith('type1', session);
  });

  test('should call genreController.add_product and remove_product after updating the product', async () => {
    await productController.put_edit_product(req, res);

    expect(genreController.add_product).toHaveBeenCalledWith('mockGenreId', 'mockProductId', session);
    expect(genreController.remove_product).toHaveBeenCalledWith('prevGenre1', 'mockProductId', session);
  });

  test('should call typeController.add_product and remove_product_by_name when type changes', async () => {
    Product.findOneAndUpdate.mockResolvedValueOnce({
      _id: 'mockProductId',
      genres: [{ _id: 'mockGenreId', name: 'genre1' }],
      type: { _id: 'differentTypeId', name: 'differentType' },
    });

    expect(typeController.add_product).toHaveBeenCalledWith('differentTypeId', 'mockProductId', session);
    expect(typeController.remove_product).toHaveBeenCalledWith('prevGenre1', 'mockProductId', session);
  });

  test('should abort the transaction and return a 500 error if an error occurs', async () => {
    Product.findOneAndUpdate.mockRejectedValue(new Error('Saving error'));

    expect(session.abortTransaction).toHaveBeenCalled();
    expect(session.endTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('put_update_stock', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: 'mockProductId' },
      body: { increment: 10 },
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnValue(),
    };
  });

  test('Should increment the number_in_stock of a given product found by id', async () => {
    const mockResult = { nModified: 1 };

    Product.findOneAndUpdate.mockResolvedValue(mockResult);

    await productController.put_update_stock(req, res);

    expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'mockProductId' },
      { $inc: { number_in_stock: 10 }, $set: { stock_last_updated: expect.any(Date) } },
    );
    expect(res.send).toHaveBeenCalledWith(mockResult);
  });

  test('should log and send the error if an error occurs', async () => {
    const mockError = new Error('Database error');

    Product.findOneAndUpdate.mockRejectedValue(mockError);

    await productController.put_update_stock(req, res);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('delete_product', () => {
  jest.mock('mongoose');
  jest.mock('../controllers/genre');
  jest.mock('../controllers/type');

  let req;
  let res;
  let session;

  beforeEach(() => {
    req = {
      params: { id: 'mockProductId' },
      body: {
        genreIds: ['mockGenre1', 'mockGenre2'],
        typeId: 'mockTypeId',
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

    // mock genre controller
    genreController.remove_product.mockResolvedValue({});

    // mock type controller
    typeController.remove_product.mockResolvedValue({});

    // mock successful deletion
    Product.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
  });

  test('should start a transaction, delete the product, and commit the transaction', async () => {
    await productController.delete_product(req, res);

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.startTransaction).toHaveBeenCalled();
    expect(Product.deleteOne).toHaveBeenCalledWith(
      { _id: 'mockProductId' },
      { session },
    );
    expect(session.commitTransaction).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  test('should abort the transaction and return a 500 error if product deletion fails', async () => {
    const mockError = new Error('Database error');
    Product.deleteOne.mockRejectedValue(mockError);

    await productController.delete_product(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });

  test('should abort the transaction and return a 500 error if genre removal fails', async () => {
    const mockError = new Error('Database error');
    genreController.remove_product.mockRejectedValue(mockError);

    await productController.delete_product(req, res);

    expect(session.abortTransaction).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(`Error deleting product mockProductId: ${mockError}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });

  test('should abort the transaction and return a 500 error if type removal fails', async () => {
    const mockError = new Error('Database error');
    typeController.remove_product.mockRejectedValue(mockError);

    await productController.delete_product(req, res);

    expect(session.abortTransaction).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(`Error deleting product mockProductId: ${mockError}`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });

  test('should handle missing genreIds or typeId gracefully', async () => {
    req.body.genreIds = null;
    req.body.typeId = null;

    await productController.delete_product(req, res);

    expect(Product.deleteOne).toHaveBeenCalled();
    expect(session.commitTransaction).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  test('should log an error if any operation fails', async () => {
    const mockError = new Error('Any error');
    Product.deleteOne.mockRejectedValue(mockError);

    await productController.delete_product(req, res);

    expect(console.log).toHaveBeenCalledWith(`Error deleting product mockProductId: ${mockError}`);
  });
});
