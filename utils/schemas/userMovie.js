const joi = require('joi');

const { movieIdSchema } = require('./movie');
const { userIdSchema } = require('./user');

const userMovieIdSchema = joi.object({
  id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
});

const createUserMovieIdSchema = joi.object({
  userId: userIdSchema,
  movieId: movieIdSchema,
});

module.exports = {
  userMovieIdSchema,
  createUserMovieIdSchema,
};
