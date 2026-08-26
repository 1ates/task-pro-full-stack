import { Schema, model } from 'mongoose';

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['without', 'low', 'medium', 'high'],
      default: 'without',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: 'column',
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'board',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const CardsCollection = model('card', cardSchema);
