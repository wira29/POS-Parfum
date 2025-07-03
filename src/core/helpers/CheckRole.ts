import { useEffect, useState } from "react";
import { useApiClient } from "./ApiClient";

export function useCheckRole(targetRole: string): boolean | null {
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await apiClient.get("/me");
        const roles: string[] = response.data.data.roles.map((role: any) => role.name);
        setHasRole(roles.includes(targetRole));
      } catch (error) {
        console.error("Gagal mengambil role:", error);
        setHasRole(false);
      }
    };

    fetchRole();
  }, [apiClient, targetRole]);

  return hasRole;
}
