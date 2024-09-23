// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useRoleListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { RoleData, RoleListRequest } from "@woi/service/co/idp/role/roleList";

function useRoleList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof RoleData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [searchRole, setSearchRole] = useState<string>('');
  const debouncedSearch = useDebounce(searchRole, 300);
  const { baseUrl } = useBaseUrl();

  const rolePayload: RoleListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    search: debouncedSearch,
    sort: sortBy ? `${sortBy}:${direction}` : ''
  };

  const {
    data: roleData,
    status: roleStatus,
    refetch: refetchRole
  } = useQuery(
    ['role-list', rolePayload],
    async () => useRoleListFetcher(baseUrl, rolePayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.data && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalElements / pagination.limit),
            totalElements: result.totalElements,
          }));
        }
      },
      onError: () => {
        setPagination(oldPagination => ({
          ...oldPagination,
          totalPages: 0,
          currentPage: 0,
          totalElements: 0,
        }));
      }
    }
  );

  const handleSort = (columnId: keyof RoleData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    searchRole,
    setSearchRole,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    roleData: roleData?.result?.data || [],
    roleStatus,
    fetchRoleList: () => {
      refetchRole();
    },
  };
}

export default useRoleList;