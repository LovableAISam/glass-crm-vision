// Cores
import { useState } from "react";

// Hooks & Utils
import { useApplicationListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useQuery } from "@tanstack/react-query";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import {
  ApplicationData,
  ApplicationListRequest,
  ApplicationStatus
} from "@woi/service/principal/admin/application/applicationList";

type FilterForm = {
  search: string;
  status: OptionMap<ApplicationStatus>[];
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

function useAppCustomizationList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof ApplicationData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const statusOptions: OptionMap<ApplicationStatus>[] = [
    {
      label: 'Active',
      value: 'ACTIVE'
    },
    {
      label: 'Error',
      value: 'ERROR'
    },
    {
      label: 'Inactive',
      value: 'INACTIVE'
    },
    {
      label: 'Pending',
      value: 'PENDING'
    }
  ];
  const { baseUrl } = useBaseUrl();

  const resetFilterForm = () => {
    setPagination(oldPagination => ({
      ...oldPagination,
      currentPage: 0,
    }));
    setFilterForm(initialFilterForm);
  };

  const getSortPayload = (paramSortBy: keyof ApplicationData) => {
    if (paramSortBy === 'name') return 'CommunityOwner.name';
    return paramSortBy;
  };

  const appCustomizationListPayload: ApplicationListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    name: debouncedFilter.search,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    status: debouncedFilter.status.map(data => data.value),
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: appCustomizationData,
    status: appCustomizationStatus,
    refetch: refetchAppCustomization
  } = useQuery(
    ['app-customization-list', appCustomizationListPayload],
    async () => await useApplicationListFetcher(baseUrl, appCustomizationListPayload),
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

  const handleSort = (columnId: keyof ApplicationData) => {
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
    appCustomizationData: appCustomizationData?.result?.data || [],
    appCustomizationStatus,
    fetchAppCustomizationList: () => {
      refetchAppCustomization();
    },
  };
}

export default useAppCustomizationList;