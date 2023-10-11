import { FC } from 'react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps {}

const LogoutButton: FC<LogoutButtonProps> = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true });
  };
  return <div className="w-full"><Button onClick={handleLogout} className="w-full">Logout</Button></div>;
};

export default LogoutButton;
