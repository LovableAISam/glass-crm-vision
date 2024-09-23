// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { batch, reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { userFundBalanceFetcher } from "@woi/service/co";
import { UserFundBalanceData, UserFundBalanceRequest } from "@woi/service/co/admin/report/userFundBalanceList";
import { useSnackbar } from "notistack";

type FilterForm = {
  memberId: string;
  rmNumber: string;
  phoneNumber: string;
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  memberId: '',
  rmNumber: '',
  phoneNumber: '',
  activeDate: {
    startDate: null,
    endDate: null,
  },
};
function useUserFundBalanceList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 50,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof UserFundBalanceData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);
  const { enqueueSnackbar } = useSnackbar();

  const userFundBalancePayload: UserFundBalanceRequest = {
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    memberId: debouncedFilter.memberId,
    phoneNumber: debouncedFilter.phoneNumber,
    rmNumber: debouncedFilter.rmNumber
  };


  const {
    data: userFundBalanceData,
    status: userFundBalanceStatus,
    refetch: refetchUserFundBalance
  } = useQuery(
    ['user-fund-balance-list', userFundBalancePayload],
    async () => userFundBalanceFetcher(baseUrl, userFundBalancePayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.fundBalanceLists && !response.error) {
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

  const handleSort = (columnId: keyof UserFundBalanceData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleDeleteFilter = (key: string, value: any) => {
    batch(() => {
      setPagination(oldPagination => ({
        ...oldPagination,
        currentPage: 0,
      }));
      setFilterForm(oldForm => ({
        ...oldForm,
        [key]: value,
      }));
    });
  };

  const handleChangeDate = (value: any): void => {
    batch(() => {
      setPagination(oldPagination => ({
        ...oldPagination,
        currentPage: 0,
      }));
      const { startDate, endDate } = value;
      if (calculateDateRangeDays(startDate, endDate) > 730) {
        enqueueSnackbar(
          'Effective date to cannot be greater than 730 days from effective date from.',
          {
            variant: 'error',
          },
        );
      } else {
        setFilterForm(oldForm => ({
          ...oldForm,
          activeDate: value,
        }));
      }
    });
  };

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    userFundBalanceData: userFundBalanceData?.result?.fundBalanceLists || [],
    userFundBalanceStatus,
    fetchUserFundBalance: () => {
      refetchUserFundBalance();
    },
    handleDeleteFilter,
    handleChangeDate
  };
}

export default useUserFundBalanceList;
