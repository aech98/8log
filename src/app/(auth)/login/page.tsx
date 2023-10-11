import { FC } from 'react';
import Link from 'next/link';
import LoginButton from '@/components/login-button';

interface LoginProps {}

export default function Login() {
  return (
    <main className="main grid place-items-center">
      <article className="flex flex-col items-center space-y-2 sm:w-[400px] pb-16 text-center">
        <h1>Welcome back to 8Log</h1>
        <p>
          Ready to dive back into the world of inspiring stories and insights?
          Log in to to get started!
        </p>
        <LoginButton />
        <p>
          New to 8Log?&nbsp;<Link href="/register">Register.</Link>
        </p>
      </article>
    </main>
  );
}
