import { Comment, Post, User } from '@prisma/client';

export type ExtendedPost = Post & {
  author: Pick<User, 'id' | 'image' | 'email' | 'name' | 'username'>;
  comment: Pick<Comment, 'id' | 'content' | 'updatedAt'>[];
};
