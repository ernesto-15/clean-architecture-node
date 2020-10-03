const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');
const { config } = require('../../../config');

const UserService = require('../../../services/users');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJWTSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, cb) => {
      try {
        const userService = new UserService();
        const user = await userService.getUsers({ email: tokenPayload.email });
        if (!user) {
          return cb(boom.unauthorized(), false);
        }
        delete user.password;
        cb(null, { ...user, scopes: tokenPayload.scopes });
      } catch (error) {
        cb(error);
      }
    }
  )
);
