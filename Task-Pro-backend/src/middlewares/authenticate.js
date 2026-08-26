import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { env } from '../utils/env.js';

export const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, accessToken] = authorization.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Not authorized'));
  }

  try {
    const payload = jwt.verify(accessToken, env('JWT_SECRET'));

    if (payload.type !== 'access') {
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await SessionsCollection.findOne({
      accessToken,
    });

    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Not authorized');
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'Not authorized');
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, 'Access token expired'));
    }
    if (error.status === 401) {
      return next(error);
    }
    next(createHttpError(401, 'Not authorized'));
  }
};
