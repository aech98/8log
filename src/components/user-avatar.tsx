import { FC } from 'react';
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AvatarProps } from '@radix-ui/react-avatar';
import Image from 'next/image';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="w-10 h-10">
          <Image
            src={user.image}
            alt="Profile Picture"
            fill
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>{user.name}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
