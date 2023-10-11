'use client';

import { FC } from 'react';
import Post from './post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import axios from 'axios';
import { ExtendedPost } from '@/types/db';

interface PostFeedProps {
  posts: ExtendedPost[];
  authorId?: string;
}

const PostFeed: FC<PostFeedProps> = ({ posts: initialPosts, authorId }) => {
  const { data, fetchNextPage } = useInfiniteQuery(
    ['user-feeds'],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get('/api/posts', {
        params: {
          limit: 2,
          page: pageParam,
          authorId: authorId ?? '',
        },
      });
      return data;
    },
    {
      initialData: { pages: [initialPosts], pageParams: [1] },
      getNextPageParam: (_, pages) => pages.length + 1,
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <div className="min-h-[calc(100vh-4rem-4rem)]">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-8">
        {posts.map((post) => (
          <li key={post.id} className="shadow-sm rounded-lg">
            <Post post={post} userId={authorId} />
          </li>
        ))}
      </ul>
      <div className="py-16 flex items-center justify-center">
        <Button variant="outline" onClick={() => fetchNextPage()}>
          Fetch more
        </Button>
      </div>
    </div>
  );
};

export default PostFeed;
