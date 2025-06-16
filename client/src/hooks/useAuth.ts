export function useAuth() {
  // Simplified auth - return mock user for now since auth system needs proper configuration
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}