const assert = require('assert');
const proxyquire = require('proxyquire');
const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib');
const { moviesMock } = require('../utils/mocks/movies');

describe('service - movies', () => {
  const MoviesService = proxyquire('../services/movies.js', {
    '../lib/mongo.js': MongoLibMock,
  });

  const moviesService = new MoviesService();

  describe('when getMovies method is called', async () => {
    it('should call the getAll MongoLib method', async () => {
      await moviesService.getMovies({});
      assert.strictEqual(getAllStub.called, true);
    });

    it('should return an array of movies', async () => {
      const result = await moviesService.getMovies({})
      const expected = moviesMock
      assert.deepStrictEqual(result, expected)
    })
  });
});
