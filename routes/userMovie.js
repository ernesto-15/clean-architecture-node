const express = require('express');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');

const { movieIdSchema } = require('../utils/schemas/movie');
const { userIdSchema } = require('../utils/schemas/user');
const {
  createUserMovieIdSchema,
  userMovieIdSchema,
} = require('../utils/schemas/userMovie');

const userMovieService = new UserMoviesService();

const userMoviesApi = (app) => {
  const movieUserRouter = express.Router();
  app.use('/api/user-movies', movieUserRouter);

  movieUserRouter.get(
    '/',
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
    validationHandler(createUserMovieIdSchema),
    async (req, res, next) => {
      try {
        const { body: userMovie } = req;
        const createdUserMovieId = await userMovieService.createUserMovie({
          userMovie,
        });
        res.status(200).json({
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
    validationHandler(movieIdSchema, 'params'),
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
