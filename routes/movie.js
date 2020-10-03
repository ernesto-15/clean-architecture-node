const express = require('express');
const MoviesService = require('../services/movies');
const validationHandler = require('../utils/middlewares/validationHandler');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');
const {
  movieIdSchema,
  createMovieSchema,
  updateSchema,
} = require('../utils/schemas/movie');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');
const passport = require('passport');
//JWT strategy
require('../utils/auth/strategies/jwt');

const moviesService = new MoviesService();

const moviesApi = (app) => {
  const movieRouter = express.Router();
  app.use('/api/movies', movieRouter);

  movieRouter.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async (req, res, next) => {
      try {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;
        const movies = await moviesService.getMovies({ tags });
        res.status(200).json({
          ok: true,
          data: movies,
          message: 'movies listed',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieRouter.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler(movieIdSchema, 'params'),
    async (req, res, next) => {
      try {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const id = req.params.id;
        const movie = await moviesService.getMovie({ id });
        if (Object.keys(movie).length === 0) {
          return res.status(200).json({
            ok: true,
            data: movie,
            message: 'no movie found',
          });
        }
        res.status(200).json({
          ok: true,
          data: movie,
          message: 'movie retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieRouter.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      try {
        const movie = req.body;
        const createdMovie = await moviesService.createMovie({ movie });
        res.status(201).json({
          ok: true,
          data: createdMovie,
          message: 'movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieRouter.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler(movieIdSchema, 'params'),
    validationHandler(updateSchema),
    async (req, res, next) => {
      try {
        const movie = req.body;
        const { id } = req.params;
        const updatedMovie = await moviesService.updateMovie({ movie, id });
        res.status(200).json({
          ok: true,
          data: updatedMovie,
          message: 'movie updated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieRouter.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler(movieIdSchema, 'params'),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const deletedMovie = await moviesService.deleteMovie({ id });
        res.status(200).json({
          ok: true,
          data: deletedMovie,
          message: 'movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
};

module.exports = moviesApi;
