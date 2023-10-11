'use client';

import { FC } from 'react';
import { Button } from './ui/button';
import { usePostEdit } from '@/lib/store';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PostActionButtonsProps {
  postId: string;
  authorId: string;
}

const PostActionButtons: FC<PostActionButtonsProps> = ({
  postId,
  authorId,
}) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = usePostEdit((state) => [
    state.isEditing,
    state.setIsEditing,
  ]);

  const { mutateAsync: deletePost } = useMutation({
    mutationFn: async (postId: string) => {
      await axios.delete(`/api/posts/${postId}`);
    },

    onMutate: () => {
      return toast.loading('Deleting Post');
    },

    onSuccess: (result, _, ctx) => {
      router.push('/posts');
      return toast.success('Post has been deleted successfully', { id: ctx });
    },

    onError: (error, _, ctx) => {
      return toast.error('Error deleting', { id: ctx });
    },
  });

  const handlePostDelete = async () => {
    await deletePost(postId);
    router.refresh();
  };

  return (
    <div className="flex item-center space-x-4">
      <Button size="sm" variant="destructive" onClick={handlePostDelete}>
        Delete
      </Button>
      {!isEditing && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      )}
      {isEditing && (
        <Button
          type="submit"
          size="sm"
          variant="outline"
          form="blog-post-submit"
        >
          publish
        </Button>
      )}
    </div>
  );
};

export default PostActionButtons;
