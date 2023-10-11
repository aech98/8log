import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EditorRenderer from './editor-renderer';
import { ExtendedPost } from '@/types/db';
import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import CommentsDrawer from './comments-drawer';

interface PostProps {
  post: ExtendedPost;
  userId?: string;
}

const Post: FC<PostProps> = ({ post, userId }) => {
  return (
    <div className="relative h-full p-4 pb-8 overflow-hidden bg-zinc-50">
      <h3 className="text-2xl text-slate-800 font-stix font-semibold mb-2">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div className="flex items-center justify-between mb-4 text-sm text-zinc-600">
        <div className="flex items-center space-x-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={post.author.image ?? ''}
              alt={post.author.name ?? ''}
              referrerPolicy="no-referrer"
              fill
              className="object-cover"
            />
          </div>
          <h4>{post.author.name}</h4>
        </div>
        <span>{`${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
          new Date(post.updatedAt)
        )} ${new Intl.DateTimeFormat('en', { weekday: 'short' }).format(
          new Date(post.updatedAt)
        )}, ${new Intl.DateTimeFormat('en', { year: '2-digit' }).format(
          new Date(post.updatedAt)
        )}`}</span>
      </div>
      <div className="h-28 overflow-clip">
        <EditorRenderer content={post.content} />
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between text-sm text-zinc-600 bg-zinc-200 px-4 py-3">
        <Link href={`/posts/${post.id}`} className="hover:underline leading-4">
          Read more
        </Link>
        <CommentsDrawer
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-x-1"
            >
              <MessageSquare className="w-4 h-4" />
              {post.comment.length}
            </Button>
          }
          postId={post.id}
          authorId={post.authorId}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default Post;
