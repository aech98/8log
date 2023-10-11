"use client";

import { FC, ReactNode } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Comment, User } from '@prisma/client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { CommentFormData, commentSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

type ExtendedComment = Comment & {
	user: Pick<User, 'id' | 'name' | 'image'>,
}	

interface CommentsDrawerProps {
  trigger: ReactNode;
  postId: string;
  authorId: string;
  userId?: string;
}

const CommentsDrawer: FC<CommentsDrawerProps> = ({
  trigger,
  postId,
  authorId,
  userId,
}) => {
  const {
    data: comments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      return data as ExtendedComment[];
    },
  });

  const { register, handleSubmit } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const { mutateAsync: postComment } = useMutation({
    mutationFn: async (payload: CommentFormData) => {
      await axios.post(`/api/posts/${postId}/comments`, payload);
    },

    onMutate: () => {
      return toast.loading('Posting comment');
    },

    onSuccess: (result, _, ctx) => {
      refetch();
      return toast.success('Comment posted', { id: ctx });
    },

    onError: (error, _, ctx) => {
      return toast.error('Error posting comment', { id: ctx });
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    const payload: CommentFormData = {
      content: data.content,
    };

    await postComment(payload);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="pb-20">
        <SheetHeader className="py-6 text-left">
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>View post comments</SheetDescription>
        </SheetHeader>
        <div>
		      <ul>
		        {comments?.map((comment) => (
		          <li key={comment.id} className="flex flex-col space-y-3 p-4 shadow-sm rounded-md">
		          	<div className="flex items-center space-x-2 text-sm text-zinc-600">
				          <div className="relative w-6 h-6 rounded-full overflow-hidden">
									  <Image
									    src={comment.user.image ?? ''}
									    alt={comment.user.name ?? ''}
									    referrerPolicy="no-referrer"
									    fill
									    className="object-cover"
									  />
									</div>
									<h4>{comment.user.name}</h4>
								</div>
								<p>{comment.content}</p>
		          </li>
		        ))}
		      </ul>
		      {!(Boolean(userId) === Boolean(authorId)) && (
		        <div className="absolute bottom-4 left-4 right-4">
		          {userId ? <form
		            onSubmit={handleSubmit(onSubmit)}
		            className="flex flex-col md:flex-row md:items-center gap-4"
		          >
		            <Input
		              {...register('content')}
		              id="content"
		              placeholder="Comment goes here..."
		            />
		            <Button>Comment</Button>
		          </form> : <div>Login to post</div> }
		        </div>
		      )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsDrawer;
