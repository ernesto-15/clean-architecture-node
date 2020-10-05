const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUsers({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { name, email, password } = user;
    const userExists = await this.verifyUserExists({ email });
    if (userExists) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.mongoDB.create(this.collection, {
      name,
      email,
      password: hashedPassword,
    });
    return createdUser;
  }

  async verifyUserExists({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async getOrCreateUser({ user }) {
    const queriedUser = await this.getUsers({ email: user.email });
    if (queriedUser) {
      return queriedUser;
    }
    await this.createUser({ user });
    return await this.getUsers({ email: user.email });
  }
}

module.exports = UserService;
