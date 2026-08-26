import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 400, message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 400, message: 'Invalid id format' });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({ status: 409, message: 'Email is already in use' });
  }

  console.error(err);
  res.status(500).json({ status: 500, message: 'Internal Server Error' });
};
