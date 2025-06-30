import { Schema, Types, model } from 'mongoose';
import { ITodo } from './todo.types';

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value > new Date();
        },
        message: 'Due date must be in the future',
      },
    },
    // 🔒 Audit fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
    editedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },

    // 👥 Task assignments
    assignedTo: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1, priority: 1 });

export const Todo = model<ITodo>('Todo', todoSchema);
