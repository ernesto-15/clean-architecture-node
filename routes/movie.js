const express = require('express');
const MoviesService = require('../services/movies');
const moviesService = new MoviesService();

const moviesApi = (app) => {
  const movieRouter = express.Router()
  app.use('/api/movies', movieRouter)

  movieRouter.get('/', async (req, res, next) => {
    try {
      const { tags } = req.query;
      const movies = await moviesService.getMovies({ tags });
      res.status(200).json({
        ok: true,
        data: movies,
        message: 'movies listed',
      });
    } catch (error) {
      next(error)
    }
  });
  
  movieRouter.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const movie = await moviesService.getMovie({ id });
      res.status(200).json({
        ok: true,
        data: movie,
        message: 'movie retrieved',
      });
    } catch (error) {
      next(error)
    }
  });
  
  movieRouter.post('/', async (req, res, next) => {
    try {
      const movie = req.body;
      const createdMovie = await moviesService.createMovie({ movie });
      res.status(201).json({
        ok: true,
        data: createdMovie,
        message: 'movie created',
      });
    } catch (error) {
      next(error)
    }
  });
  
  movieRouter.put('/:id', async (req, res, next) => {
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
      next(error)
    }
  });
  
  movieRouter.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedMovie = await moviesService.deleteMovie({ id });
      res.status(200).json({
        ok: true,
        data: deletedMovie,
        message: 'movie deleted',
      });
    } catch (error) {
      next(error)
    }
  });

}



module.exports = moviesApi;
