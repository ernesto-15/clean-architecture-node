const joi = require('joi');

const movieTitleSchema = joi.string().max(80);
const movieYearSchema = joi.number().min(1888).max(2077);
const movieCoverSchema = joi.string().uri();
const movieDescriptionSchema = joi.string().max(300);
const movieDurationSchema = joi.number().min(1).max(300);
const contentRatingSchema = joi.string().max(5);
const movieSourceSchema = joi.string().uri();
const movieTagsSchema = joi.array().items(joi.string().max(50));

const movieIdSchema = joi.object({
  id: joi.string()
})

const createMovieSchema = joi.object({
  title: movieTitleSchema.required(),
  year: movieYearSchema.required(),
  cover: movieCoverSchema.required(),
  description: movieDescriptionSchema.required(),
  duration: movieDurationSchema.required(),
  contentRating: contentRatingSchema.required(),
  source: movieSourceSchema.required(),
  tags: movieTagsSchema,
})

const updateSchema = joi.object({
  title: movieTitleSchema,
  year: movieYearSchema,
  cover: movieCoverSchema,
  description: movieDescriptionSchema,
  duration: movieDurationSchema,
  contentRating: contentRatingSchema,
  source: movieSourceSchema,
  tags: movieTagsSchema,
});

module.exports = {
  movieIdSchema,
  createMovieSchema,
  updateSchema,
};
