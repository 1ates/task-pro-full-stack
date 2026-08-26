import createHttpError from 'http-errors';
import { BoardsCollection } from '../db/models/board.js';
import { ColumnsCollection } from '../db/models/column.js';
import { CardsCollection } from '../db/models/card.js';

export const createColumnController = async (req, res) => {
  const { boardId } = req.params;

  const board = await BoardsCollection.findOne({
    _id: boardId,
    owner: req.user._id,
  });

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  const column = await ColumnsCollection.create({
    ...req.body,
    boardId: board._id,
    owner: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Column created successfully',
    data: {
      ...column.toObject(),
      cards: [],
    },
  });
};

export const updateColumnController = async (req, res) => {
  const { columnId } = req.params;

  const column = await ColumnsCollection.findOneAndUpdate(
    { _id: columnId, owner: req.user._id },
    req.body,
    { new: true },
  );

  if (!column) {
    throw createHttpError(404, 'Column not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Column updated successfully',
    data: column,
  });
};

export const deleteColumnController = async (req, res) => {
  const { columnId } = req.params;

  const column = await ColumnsCollection.findOneAndDelete({
    _id: columnId,
    owner: req.user._id,
  });

  if (!column) {
    throw createHttpError(404, 'Column not found');
  }

  await CardsCollection.deleteMany({
    columnId: column._id,
    owner: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Column deleted successfully',
    data: column,
  });
};
