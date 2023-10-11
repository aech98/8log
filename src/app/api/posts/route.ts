import { z, ZodError } from 'zod';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { postSchema } from '@/lib/validation';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const { limit, page, authorId } = await z
      .object({
        limit: z.string(),
        page: z.string(),
        authorId: z.string().optional(),
      })
      .parseAsync({
        page: url.searchParams.get('page'),
        limit: url.searchParams.get('limit'),
        authorId: url.searchParams.get('authorId'),
      });

    let where = authorId ? { authorId } : {};

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' },
      where,
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

    return new Response(JSON.stringify(posts));
  } catch (error) {
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

    const body = await req.json();

    const { title, content, authorId } = await postSchema.parseAsync(body);

    await db.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    return new Response('Post created successfully', { status: 201 });
  } catch (error) {
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
