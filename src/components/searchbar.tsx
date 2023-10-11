'use client';

import { FC } from 'react';
import { Input } from './ui/input';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  return <div>{<Input type="search" />}</div>;
};

export default SearchBar;
