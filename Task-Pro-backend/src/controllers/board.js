import createHttpError from 'http-errors';
import { BoardsCollection } from '../db/models/board.js';
import { ColumnsCollection } from '../db/models/column.js';
import { CardsCollection } from '../db/models/card.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/SaveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllBoardController = async (req, res) => {
  const boards = await BoardsCollection.find({ owner: req.user._id });
  res.status(200).json({
    status: 200,
    message: 'Boards retrieved successfully',
    data: boards,
  });
};

export const getByIdBoardController = async (req, res) => {
  const { boardId } = req.params;

  const board = await BoardsCollection.findOne({
    _id: boardId,
    owner: req.user._id,
  });

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  const columns = await ColumnsCollection.find({
    boardId: board._id,
    owner: req.user._id,
  }).sort({
    createdAt: 1,
  });

  const cards = await CardsCollection.find({
    boardId: board._id,
    owner: req.user._id,
  }).sort({
    createdAt: 1,
  });

  const columnsWithCards = columns.map((column) => ({
    ...column.toObject(),
    cards: cards.filter(
      (card) => card.columnId.toString() === column._id.toString(),
    ),
  }));

  res.status(200).json({
    status: 200,
    message: 'Board retrieved successfully',
    data: {
      ...board.toObject(),
      columns: columnsWithCards,
    },
  });
};

export const createBoardController = async (req, res) => {
  const board = await BoardsCollection.create({
    ...req.body,
    owner: req.user._id,
  });
  res
    .status(201)
    .json({ status: 201, message: 'Board created successfully', data: board });
};

export const updateBoardController = async (req, res) => {
  const { boardId } = req.params;

  const board = await BoardsCollection.findOneAndUpdate(
    {
      _id: boardId,
      owner: req.user._id,
    },
    req.body,
    { new: true },
  );

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  res
    .status(200)
    .json({ status: 200, message: 'Board updated successfully', data: board });
};

export const deleteBoardController = async (req, res) => {
  const { boardId } = req.params;

  const board = await BoardsCollection.findOneAndDelete({
    _id: boardId,
    owner: req.user._id,
  });

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  await ColumnsCollection.deleteMany({ boardId: board._id });

  await CardsCollection.deleteMany({ boardId: board._id });

  res.status(200).json({
    status: 200,
    message: 'Board deleted successfully',
    data: board,
  });
};

export const updateBoardBackgroundController = async (req, res) => {
  const { boardId } = req.params;
  if (!req.file) {
    throw createHttpError(400, 'Background image is required!');
  }
  const board = await BoardsCollection.findOne({
    _id: boardId,
    owner: req.user._id,
  });
  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  const backgroundUrl =
    env('ENABLE_CLOUDINARY') === 'true'
      ? await saveFileToCloudinary(req.file, 'taskpro/boards')
      : await saveFileToUploadDir(req.file, 'background');

  board.background = backgroundUrl;
  await board.save();

  res.status(200).json({
    status: 200,
    message: 'Board background updated successfully',
    data: board,
  });
};
