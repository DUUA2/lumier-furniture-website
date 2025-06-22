import { useQuery } from "@tanstack/react-query";

export function useLocalAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/current-user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/current-user');
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return await response.json();
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}