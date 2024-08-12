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

describe('get_all', () => {});

describe('add_product', () => {});

describe('remove_product', () => {});
