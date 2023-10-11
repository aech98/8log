'use client';

import { FC } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

interface LoginButtonProps {}

const LoginButton: FC<LoginButtonProps> = () => {
  const handleLogin = async () => {
    try {
    console.log("Hello");
      await signIn('google');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <Button onClick={handleLogin} className="w-full" >
        Login
      </Button>
    </div>
  );
};

export default LoginButton;
