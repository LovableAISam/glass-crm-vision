// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useMemberListFetcher } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { MemberData, MemberListRequest } from "@woi/service/co/idp/member/memberList";
import { DatePeriod } from "@woi/core/utils/date/types";

type FilterForm = {
  phoneNumber: string;
  name: string;
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  phoneNumber: '',
  name: '',
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

function useMemberSummaryList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MemberData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const memberPayload: MemberListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
    name: debouncedFilter.name || '',
    phoneNumber: debouncedFilter.phoneNumber,
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const {
    data: memberData,
    status: memberStatus,
    refetch: refetchMember
  } = useQuery(
    ['member-list', memberPayload],
    async () => useMemberListFetcher(baseUrl, memberPayload),
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

  const handleSort = (columnId: keyof MemberData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberData: memberData?.result?.data || [],
    memberStatus,
    fetchMemberList: () => {
      refetchMember();
    },
  };
}

export default useMemberSummaryList;
