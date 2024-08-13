/* eslint-disable no-console */
/* eslint-disable no-undef */
const Genre = require('../models/genre');
const genreController = require('../controllers/genreController');

jest.mock('../models/genre');

describe('get_id', () => {
  test('should return an empty string if the genre is empty', async () => {
    const genre = '';

    const result = await genreController.get_id(genre);

    expect(result).toBe('');
  });

  test('should find or create a genre and return its ID', async () => {
    const genre = 'mockGenre';
    const genreId = 'mockGenreId';
    const mockGenre = { _id: genreId, name: genre.toLowerCase() };

    Genre.findOneAndUpdate.mockResolvedValue(mockGenre);

    const result = await genreController.get_id(genre);

    expect(Genre.findOneAndUpdate).toHaveBeenCalledWith(
      { name: 'mockgenre' },
      { name: 'mockgenre' },
      { upsert: true, new: true },
    );

    expect(result).toBe(genreId);
  });

  test('should return null if an error occurs', async () => {
    const genre = 'mockGenre';
    const mockError = new Error('Database error');

    Genre.findOneAndUpdate.mockRejectedValue(mockError);

    const result = await genreController.get_id(genre);

    expect(Genre.findOneAndUpdate).toHaveBeenCalledWith(
      { name: 'mockgenre' },
      { name: 'mockgenre' },
      { upsert: true, new: true },
    );

    expect(result).toBe(null);
  });
});

describe('get_all', () => {
  test('should retrieve and return all genres sorted by name', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockGenres = [{ name: 'genre1' }, { name: 'genre2' }];

    Genre.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockGenres),
    });

    await genreController.get_all(req, res);

    expect(Genre.find).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockGenres);
  });

  test('should log the error if an error occurs', async () => {
    const req = {};
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Genre.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(mockError),
    });

    await genreController.get_all(req, res);

    expect(Genre.find).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(mockError);
  });
});

describe('add_product', () => {
  test('should add product to database', async () => {
    const mockGenreId = 'mockGenreId';
    const mockProductId = 'mockProductId';
    const mockResult = { nModified: 1 };

    Genre.updateOne.mockResolvedValue(mockResult);

    const result = await genreController.add_product(mockGenreId, mockProductId);

    expect(Genre.updateOne).toHaveBeenCalledWith(
      { _id: mockGenreId },
      { $addToSet: { products: mockProductId } },
      {},
    );
    expect(result).toBe(mockResult);
  });

  test('should log and throw error on database issue', async () => {
    const mockGenreId = 'mockGenreId';
    const mockProductId = 'mockProductId';
    const mockError = new Error('Database error');

    Genre.updateOne.mockRejectedValue(mockError);

    console.log = jest.fn();

    await expect(
      genreController.add_product(mockGenreId, mockProductId),
    ).rejects.toThrow(mockError);
    expect(Genre.updateOne).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      `Error adding product ${mockProductId} to genre ${mockGenreId}: ${mockError}`,
    );
  });
});

describe('remove_product', () => {
  test('should remove product form database', async () => {
    const mockGenreId = 'mockGenreId';
    const mockProductId = 'mockProductId';
    const mockResult = { nModified: 1 };

    Genre.updateOne.mockResolvedValue(mockResult);

    const result = await genreController.remove_product(mockGenreId, mockProductId);

    expect(Genre.updateOne).toHaveBeenCalledWith(
      { _id: mockGenreId },
      { $pull: { products: mockProductId } },
      {},
    );
    expect(result).toBe(mockResult);
  });

  test('should log and throw error on database issue', async () => {
    const mockGenreId = 'mockGenreId';
    const mockProductId = 'mockProductId';
    const mockError = new Error('Database error');

    console.log = jest.fn();

    Genre.updateOne.mockRejectedValue(mockError);

    await expect(
      genreController.remove_product(mockGenreId, mockProductId),
    ).rejects.toThrow(mockError);
    expect(Genre.updateOne).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      `Error removing product ${mockProductId} from genre ${mockGenreId}: ${mockError}`,
    );
  });
});
