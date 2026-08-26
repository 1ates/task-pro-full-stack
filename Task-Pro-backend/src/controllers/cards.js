import createHttpError from 'http-errors';
import { ColumnsCollection } from '../db/models/column.js';
import { CardsCollection } from '../db/models/card.js';

export const createCardsController = async (req, res) => {
  const { columnId } = req.params;

  const column = await ColumnsCollection.findOne({
    _id: columnId,
    owner: req.user._id,
  });

  if (!column) {
    throw createHttpError(404, 'Column not found');
  }

  const card = await CardsCollection.create({
    ...req.body,
    columnId: column._id,
    boardId: column.boardId,
    owner: req.user._id,
  });

  res
    .status(201)
    .json({ status: 201, message: 'Card created successfully', data: card });
};

export const updateCardsController = async (req, res) => {
  const { cardId } = req.params;

  const card = await CardsCollection.findOneAndUpdate(
    { _id: cardId, owner: req.user._id },
    req.body,
    { new: true },
  );

  if (!card) {
    throw createHttpError(404, 'Card not found');
  }

  res
    .status(200)
    .json({ status: 200, message: 'Card updated successfully', data: card });
};

export const deleteCardsController = async (req, res) => {
  const { cardId } = req.params;

  const card = await CardsCollection.findOneAndDelete({
    _id: cardId,
    owner: req.user._id,
  });

  if (!card) {
    throw createHttpError(404, 'Card not found');
  }

  res.status(200).json({ status: 200, message: 'Card deleted successfully' });
};

export const moveCardsController = async (req, res) => {
  const { cardId } = req.params;
  const { columnId } = req.body;

  const card = await CardsCollection.findOne({
    _id: cardId,
    owner: req.user._id,
  });

  if (!card) {
    throw createHttpError(404, 'Card not found');
  }

  const column = await ColumnsCollection.findOne({
    _id: columnId,
    owner: req.user._id,
    boardId: card.boardId,
  });

  if (!column) {
    throw createHttpError(404, 'Column not found');
  }

  const updatedCard = await CardsCollection.findOneAndUpdate(
    { _id: cardId, owner: req.user._id },
    { columnId },
    { new: true },
  );

  res
    .status(200)
    .json({
      status: 200,
      message: 'Card moved successfully',
      data: updatedCard,
    });
};
