import { NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';
import { getGoogleCredentials, nextAuthSecret } from '@/configs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: nextAuthSecret,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().googleClientId,
      clientSecret: getGoogleCredentials().googleClientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },
    async jwt({ token, user }) {
      const userFromDb = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!userFromDb) {
        token.id = user!.id;
        return token;
      }

      if (!userFromDb.username) {
        await db.user.update({
          where: {
            id: userFromDb.id,
          },
          data: { username: 'Anonymous' },
        });
      }

      return {
        id: userFromDb.id,
        name: userFromDb.name,
        email: userFromDb.email,
        picture: userFromDb.image,
        username: userFromDb.username,
      };
    },

    redirect() {
      return '/';
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
