const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MovieServiceMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');

describe('routes - movies', function () {
  const route = proxyquire('../routes/movie.js', {
    '../services/movies.js': MovieServiceMock,
  });

  const request = testServer(route);

  describe('GET /movies', function () {
    it('should respond with status 200', function (done) {
      request.get('/api/movies').expect(200, done);
    });

    it('should respond with the list of movies', function (done) {
      request.get('/api/movies').end((err, res) => {
        assert.deepStrictEqual(res.body, {
          ok: true,
          data: moviesMock,
          message: 'movies listed',
        });

        done();
      });
    });
  });

  describe('POST /movies', () => {
    it('should respond with the id created', (done) => {
      request.post('/api/movies').send(moviesMock[1]).end((err, res) => {
        assert.deepStrictEqual(res.body, {
          ok: true,
          data: moviesMock[0].id,
          message: 'movie created',
        });
        done()
      });
    });
  });
});
