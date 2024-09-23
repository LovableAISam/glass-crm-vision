// Cores
import { useMemo, useState } from "react";

// Hooks & Utils
import { useCommunityOwnerListFetcher, useMemberListFetcher } from "@woi/service/principal";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { reverseDirection } from "@woi/core";
import { useQuery } from "@tanstack/react-query";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { MemberData, MemberListRequest } from "@woi/service/principal/admin/member/memberList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";

export type StatusType = 'REGISTERED' | 'UNREGISTERED';

type FilterForm = {
  name: string;
  phoneNumber: string;
  status: OptionMap<StatusType>[];
  activeDate: DatePeriod;
  communityOwner: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  name: '',
  phoneNumber: '',
  status: [],
  activeDate: {
    startDate: null,
    endDate: null,
  },
  communityOwner: [],
};

function useMemberList() {
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
  const statusOptions: OptionMap<StatusType>[] = [
    { label: 'Registered', value: 'REGISTERED' },
    { label: 'Unregistered', value: 'UNREGISTERED' },
  ];

  const { data: communityOwnerList } = useQuery(
    ['co-list'],
    async () => await useCommunityOwnerListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    }),
    { refetchOnWindowFocus: false }
  );

  const coOptions: OptionMap<string>[] = useMemo(() => {
    if (!communityOwnerList) return [];
    return (communityOwnerList.result?.data || []).map(data => ({
      label: data.name,
      value: data.id
    }));
  }, [communityOwnerList]);

  const memberPayload: MemberListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    memberName: debouncedFilter.name,
    memberVA: debouncedFilter.phoneNumber,
    coCodes: debouncedFilter.communityOwner.map(data => data.value),
    status: debouncedFilter.status.map(data => data.value === 'REGISTERED'),
    activeDate: stringToDateFormat(debouncedFilter.activeDate.startDate),
    inactiveDate: stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: memberData,
    status: memberStatus,
    refetch: refetchMember
  } = useQuery(
    ['member-list', memberPayload],
    async () => await useMemberListFetcher(baseUrl, memberPayload),
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
    coOptions,
    statusOptions,
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

export default useMemberList;
