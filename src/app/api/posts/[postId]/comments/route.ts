import { z, ZodError } from 'zod';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { commentSchema } from '@/lib/validation';

export async function GET(req: Request) {
  try {
    const paths = req.url.split('/');

    const postId = paths[paths.length - 2];

    const { postId: validatedPostId } = await z
      .object({ postId: z.string() })
      .parseAsync({ postId });

    const comments = await db.comment.findMany({
      where: { postId: validatedPostId },
      include: { user: { select: { name: true, image: true, id: true } } },
    });

    return new Response(JSON.stringify(comments), { status: 201 });
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

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Forbidden request', {
        status: 401,
      });
    }

    const paths = req.url.split('/');

    const postId = paths[paths.length - 2];

    const { postId: validatedPostId } = await z
      .object({ postId: z.string() })
      .parseAsync({ postId });

    const body = await req.json();

    const { content } = await commentSchema.parseAsync(body);

    await db.comment.create({
      data: {
        content,
        userId: session?.user.id,
        postId: validatedPostId,
      },
    });

    return new Response('Comment posted successfully', { status: 201 });
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
