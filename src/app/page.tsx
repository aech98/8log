import Link from 'next/link';
import PostFeed from '@/components/post-feed';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/db';

export default async function Home() {
	const data = await db.post.findMany({
    take: 2,
    orderBy: { updatedAt: 'desc' },
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
     <h1>Post Feed</h1>
    </div>
    
    <PostFeed posts={data} />
  </main>
)}
