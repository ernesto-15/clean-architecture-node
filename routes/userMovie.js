const express = require('express');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');

const { movieIdSchema } = require('../utils/schemas/movie');
const { userIdSchema } = require('../utils/schemas/user');
const {
  createUserMovieIdSchema,
  userMovieIdSchema,
} = require('../utils/schemas/userMovie');
const passport = require('passport');
require('../utils/auth/strategies/jwt');

const userMovieService = new UserMoviesService();

const userMoviesApi = (app) => {
  const movieUserRouter = express.Router();
  app.use('/api/user-movies', movieUserRouter);

  movieUserRouter.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler(userIdSchema, 'query'),
    async (req, res, next) => {
      try {
        const { userId } = req.query;
        const userMovies = await userMovieService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: 'User movies listed',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieUserRouter.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user-movies']),
    // validationHandler(createUserMovieIdSchema),
    async (req, res, next) => {
      try {
        const { body: userMovie } = req;
        const createdUserMovieId = await userMovieService.createUserMovie({
          userMovie,
        });
        res.status(201).json({
          data: createdUserMovieId,
          message: 'User-Movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  movieUserRouter.delete(
    '/:userMovieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user-movies']),
    // validationHandler(movieIdSchema, 'params'),
    async (req, res, next) => {
      try {
        const { userMovieId } = req.params;
        const deletedUserMovieId = await userMovieService.deleteUserMovie({
          userMovieId,
        });
        res.status(200).json({
          data: deletedUserMovieId,
          message: 'User-Movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
};

module.exports = userMoviesApi;
