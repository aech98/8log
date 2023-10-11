import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function CreatePost() {
  const session = await getAuthSession();

  if (!session?.user) {
    return notFound();
  }

  return (
    <main className="main !pt-0">
      <div className="header">
        <div className="w-full flex items-center justify-between">
          <h1>Create post</h1>
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            form="blog-post-submit"
          >
            Publish
          </Button>
        </div>
      </div>
      <Editor authorId={session?.user.id} />
    </main>
  );
}
