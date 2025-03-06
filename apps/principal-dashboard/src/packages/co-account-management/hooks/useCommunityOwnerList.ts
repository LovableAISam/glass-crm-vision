// Cores
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useCommunityOwnerListFetcher, useCommunityOwnerStatusListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Utils
import { PaginationData } from "@woi/core/api";
import { CommunityOwnerData, CommunityOwnerListRequest, CommunityOwnerStatusType } from "@woi/service/principal/admin/communityOwner/communityOwnerList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";

type FilterForm = {
  search: string;
  status: OptionMap<CommunityOwnerStatusType>[];
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  search: '',
  status: [],
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

function useCommunityOwnerList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof CommunityOwnerData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const resetFilterForm = () => setFilterForm(initialFilterForm);

  const { data: communityOwnerStatusList } = useQuery(
    ['co-status-list'],
    async () => await useCommunityOwnerStatusListFetcher(baseUrl),
    { refetchOnWindowFocus: false }
  );

  const statusOptions: OptionMap<CommunityOwnerStatusType>[] = useMemo(() => {
    if (!communityOwnerStatusList?.result) return [];
    return (Object.entries(communityOwnerStatusList?.result).map(([key, value]) => ({
      label: value,
      value: key as CommunityOwnerStatusType
    })));
  }, [communityOwnerStatusList]);

  const communityOwnerPayload: CommunityOwnerListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    name: debouncedFilter.search,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    status: debouncedFilter.status.map(data => data.value),
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: communityOwnerData,
    status: communityOwnerStatus,
    refetch: refetchCommunityOwner
  } = useQuery(
    ['community-owner-list', communityOwnerPayload],
    async () => await useCommunityOwnerListFetcher(baseUrl, communityOwnerPayload),
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

  const handleSort = (columnId: keyof CommunityOwnerData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    statusOptions,
    filterForm,
    setFilterForm,
    resetFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    communityOwnerData: communityOwnerData?.result?.data || [],
    communityOwnerStatus,
    fetchCommunityOwnerList: () => {
      refetchCommunityOwner();
    },
  };
}

export default useCommunityOwnerList;