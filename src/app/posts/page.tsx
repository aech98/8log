import Link from 'next/link';
import PostFeed from '@/components/post-feed';
import { getAuthSession } from '@/lib/auth';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function Feed() {
  const session = await getAuthSession();

  if (!session?.user) {
    return notFound();
  }

  const data = await db.post.findMany({
    take: 2,
    orderBy: { updatedAt: 'desc' },
    where: { authorId: session?.user.id },
    include: {
      author: {
        select: {
          id: true,
          image: true,
          email: true,
          username: true,
          name: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
          updatedAt: true,
        },
      },
    },
  });

  return (
    <main className="main !pt-0">
      <div className="header">
        <div className="w-full flex items-center justify-between">
          <h1>User drafts</h1>
          <Link
            href="/posts/create"
            className={buttonVariants({ size: 'sm', variant: 'default' })}
          >
            Create post
          </Link>
        </div>
      </div>
      <PostFeed posts={data} authorId={session?.user.id} />
    </main>
  );
}
