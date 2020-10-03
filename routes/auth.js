const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const UserService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');
const { createUserSchema } = require('../utils/schemas/user');
const { config } = require('../config');

//Basic Strategy
require('../utils/auth/strategies/basic');

const apiKeysService = new ApiKeysService();
const userService = new UserService();

const authApi = (app) => {
  const authRouter = express.Router();
  app.use('/api/auth', authRouter);

  //Sign In
  authRouter.post('/sign-in', async (req, res, next) => {
    const { apiKeyToken } = req.body;
    if (!apiKeyToken) {
      next(boom.unauthorized('Api Key is required'));
    }
    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }
        req.login(user, { session: false }, async (error) => {
          if (error) next(error);
          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });
          if (!apiKey) {
            next(boom.unauthorized());
          }
          const { _id: id, name, email } = user;
          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          };

          const token = jwt.sign(payload, config.authJWTSecret, {
            expiresIn: '15m',
          });

          return res.status(200).json({
            token,
            user: {
              id,
              name,
              email,
            },
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  //Sign-up
  authRouter.post(
    '/sign-up',
    validationHandler(createUserSchema),
    async (req, res, next) => {
      try {
        const { body: user } = req;
        const createdUserId = await userService.createUser({ user });
        res.status(201).json({
          data: createdUserId,
          message: 'User created',
        });
      } catch (error) {
        next(error);
      }
    }
  );
};

module.exports = authApi;
