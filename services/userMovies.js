const MongoLib = require('../lib/mongo');

class UserMoviesService {
  constructor() {
    this.collection = 'user-movies';
    this.mongoDb = new MongoLib();
  }

  async getUserMovies({ userId }) {
    const query = userId && { userId };
    const userMovies = await this.mongoDb.getAll(this.collection, query);
    return userMovies || [];
  }

  async createUserMovie({ userMovie }) {
    const createdMovieId = await this.mongoDb.create(
      this.collection,
      userMovie
    );
    return createdMovieId;
  }

  async deleteUserMovie({ userMovieId }) {
    const deletedMovieId = await this.mongoDb.delete(
      this.collection,
      userMovieId
    );
    return deletedMovieId;
  }
}

module.exports = UserMoviesService;
