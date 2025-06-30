import { ITodo } from '@/modules/todo/todo.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId;
        email: string;
        roles: Types.ObjectId[];
      };
    }
  }
}
