import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
     queryFn: () =>
      fetch("/api/auth/user", { credentials: "include" }).then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      }),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
