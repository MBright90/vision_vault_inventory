/* eslint-disable no-undef */
const Type = require('../models/type');
const typeController = require('../controllers/typeController');

jest.mock('../models/type');

describe('get_all', () => {
  test('should retrieve and return all types sorted by name', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockTypes = [{ name: 'Type1' }, { name: 'Type2' }];

    Type.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockTypes),
    });

    await typeController.get_all(req, res);

    expect(Type.find).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockTypes);
  });

  test('should return a 500 status and the error message if an error occurs', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    Type.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await typeController.get_all(req, res);

    expect(Type.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(mockError);
  });
});

describe('get_id', () => {
  test('should find or create a type and return its ID', async () => {
    const type = 'Type1';
    const mockId = 'mockTypeId';
    const mockType = { _id: mockId, name: type.toLowerCase() };

    Type.findOneAndUpdate.mockResolvedValue(mockType);

    const result = await typeController.get_id(type);

    expect(Type.findOneAndUpdate).toHaveBeenCalledWith(
      { name: type.toLowerCase() },
      { name: type.toLowerCase() },
      { upsert: true, new: true },
    );
    expect(result).toBe(mockId);
  });

  test('should handle errors and throw them', async () => {
    const type = 'Type1';
    const mockError = new Error('Database error');

    Type.findOneAndUpdate.mockRejectedValue(mockError);

    await expect(typeController.get_id(type)).rejects.toThrow(mockError);
  });
});

describe('add_product', () => {
  test('should add a product of the correct type', async () => {
    const typeId = 'mockTypeId';
    const productId = 'mockProductId';
    const mockResult = { nModified: 1 };

    Type.updateOne.mockResolvedValue(mockResult);

    const result = await typeController.add_product(typeId, productId);

    expect(Type.updateOne).toHaveBeenCalledWith(
      { _id: typeId },
      { $push: { products: productId } },
      {},
    );
    expect(result).toBe(mockResult);
  });

  test('should handle errors and throw them', async () => {
    const typeId = 'mockTypeId';
    const productId = 'mockProductId';
    const mockError = new Error('Database error');

    Type.updateOne.mockRejectedValue(mockError);

    await expect(typeController.add_product(typeId, productId)).rejects.toThrow(mockError);
  });
});

describe('remove_product', () => {
  test('should remove product from type', async () => {
    const typeId = 'mockTypeId';
    const productId = 'mockProductId';
    const mockResult = { nModified: 1 };

    Type.updateOne.mockResolvedValue(mockResult);

    const result = await typeController.remove_product(typeId, productId);

    expect(Type.updateOne).toHaveBeenCalledWith(
      { _id: typeId },
      { $pull: { products: productId } },
      {},
    );
    expect(result).toBe(mockResult);
  });

  test('should handle errors and throw them', async () => {
    const typeId = 'mockTypeId';
    const productId = 'mockProductId';
    const mockError = new Error('Database error');

    Type.updateOne.mockRejectedValue(mockError);

    await expect(typeController.remove_product(typeId, productId)).rejects.toThrow(mockError);
  });
});

