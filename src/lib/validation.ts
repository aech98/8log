import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title cannot be less than 3 characters!')
    .max(64, 'Title cannot be more than 64 characters!'),
  content: z.any(),
  authorId: z.string({ required_error: 'UserId cannot be empty' }),
});

export type PostFormData = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  content: z.string().min(3, 'Required'),
});

export type CommentFormData = z.infer<typeof commentSchema>;
