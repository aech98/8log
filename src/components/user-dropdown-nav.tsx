"use client";

import { FC } from 'react';
import { User } from 'next-auth';
import { PenSquare } from 'lucide-react';
import UserAvatar from './user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import LogoutButton from './logout-button';

interface UserDropdownNavProps {
  user: Pick<User, 'image' | 'name'>;
}

const UserDropdownNav: FC<UserDropdownNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className="p-4 w-64">
        <DropdownMenuGroup className="py-4">
          <DropdownMenuItem asChild>
          	<div className="flex items-center space-x-2">
          		<PenSquare className="w-4 h4" />
          		<Link href="/posts/create">Create Post</Link>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="py-4">
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownNav;
