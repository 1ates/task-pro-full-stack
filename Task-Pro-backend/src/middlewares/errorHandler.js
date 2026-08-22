import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
