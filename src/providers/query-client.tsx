'use client';

import { FC, PropsWithChildren, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps extends PropsWithChildren {}

const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
