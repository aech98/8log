import { FC } from 'react';
import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import UserDropdownNav from './user-dropdown-nav';
import { buttonVariants } from './ui/button';

interface HeaderProps {}

const Header: FC<HeaderProps> = async () => {
  const session = await getAuthSession();

  return (
    <header className="header">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-base font-stix font-medium">
          8log
        </Link>
        {/* <SearchBar /> */}
        {session?.user ? (
          <UserDropdownNav user={session?.user} />
        ) : (
          <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
