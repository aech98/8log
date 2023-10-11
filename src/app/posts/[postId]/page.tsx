import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, MoveLeft } from 'lucide-react';
import Editor from '@/components/editor';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import PostActionButtons from '@/components/post-action-buttons';
import CommentsDrawer from '@/components/comments-drawer';
import { Button } from '@/components/ui/button';

interface PostByIdProps {
  params: { postId: string };
}

export default async function PostById({ params }: PostByIdProps) {
  const session = await getAuthSession();

  const postById = await db.post.findFirst({
    where: { id: params.postId },
  });

  if (!postById) {
    return notFound();
  }

  return (
    <main className="main !pt-0">
      <div className="header">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={session?.user ? "/posts" : "/"}>{<MoveLeft className="h-6" />}</Link>
            <h1>Post</h1>
          </div>
          <div className="flex items-center space-x-2">
		        {session?.user.id === postById.authorId && (
		          <PostActionButtons
		            postId={postById.id}
		            authorId={postById.authorId}
		          />
		        )}
		        <CommentsDrawer
		          trigger={
		            <Button
		              variant="ghost"
		              size="sm"
		              className="flex items-center gap-x-1"
		            >
		              <MessageSquare className="w-4 h-4" />
		              <span className="hidden md:inline-block">Comments</span>
		            </Button>
		          }
		          postId={postById.id}
		          authorId={postById.authorId}
		          userId={session?.user.id}
		        />
          </div>
        </div>
      </div>
      <Editor
        postId={postById.id}
        title={postById.title}
        content={postById.content}
        authorId={session?.user.id}
      />
    </main>
  );
}
