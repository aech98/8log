import { z, ZodError } from 'zod';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { postSchema } from '@/lib/validation';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Forbidden request', {
        status: 401,
      });
    }

    const paths = req.url.split('/');

    const postId = paths[paths.length - 1];

    const { postId: validatedPostId } = await z
      .object({ postId: z.string() })
      .parseAsync({ postId });

    const body = await req.json();

    const { title, content, authorId } = await postSchema.parseAsync(body);

    await db.post.update({
      where: { id: validatedPostId },
      data: { title, content, authorId },
    });

    return new Response('Post updated successfully', { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return new Response('Bad request', {
        status: 400,
      });
    }

    return new Response('Something went wrong. Please try again later!', {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Forbidden request', {
        status: 401,
      });
    }

    const paths = req.url.split('/');

    const postId = paths[paths.length - 1];

    const { postId: validatedPostId } = await z
      .object({ postId: z.string() })
      .parseAsync({ postId });

    await db.post.delete({
      where: { id: validatedPostId },
    });

    return new Response('Post deleted successfully', { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return new Response('Bad request', {
        status: 400,
      });
    }

    return new Response('Something went wrong. Please try again later!', {
      status: 500,
    });
  }
}
