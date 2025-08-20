import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { handleApiError } from "./error-handling";

// 创建带有全局错误处理的QueryClient
const createQueryClientWithErrorHandling = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分钟
        gcTime: 10 * 60 * 1000, // 10分钟
        retry: 3,
        retryDelay: (attemptIndex: number) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
        retryDelay: (attemptIndex: number) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.error("Query error:", error);
        handleApiError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error("Mutation error:", error);
        handleApiError(error);
      },
    }),
  });
};

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = React.useState(() =>
    createQueryClientWithErrorHandling()
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
