import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: false, // Disable automatic fetching
  });

  // Only fetch if we have a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !query.isFetching && !query.data) {
      query.refetch();
    }
  }, []);

  return {
    ...query,
    // Add a manual refetch function that can be called when needed
    refetch: () => {
      const token = localStorage.getItem('token');
      if (token) {
        return query.refetch();
      }
      return Promise.resolve(null);
    }
  };
};

export default useAuth;
