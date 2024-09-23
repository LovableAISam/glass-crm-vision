// Cores
import { useState } from "react";

// Hooks & Utils
import { useKycPremiumMemberDownloadFetcher, useKycPremiumMemberHistoryListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import {
  KycPremiumMemberHistoryData,
  KycPremiumMemberHistoryListRequest,
  KycPremiumMemberStatus
} from "@woi/service/principal/kyc/premiumMember/premiumMemberHistoryList";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

type FilterForm = {
  fullName: string;
  phoneNumber: string;
  verificationDate: DatePeriod;
  status: OptionMap<KycPremiumMemberStatus>[];
};

const initialFilterForm: FilterForm = {
  fullName: '',
  phoneNumber: '',
  verificationDate: {
    startDate: null,
    endDate: null,
  },
  status: [],
};

function useKycRequestHistoryList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof KycPremiumMemberHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const statusOptions: OptionMap<KycPremiumMemberStatus>[] = [
    { label: 'Approve', value: 'PREMIUM' },
    { label: 'Rejected', value: 'UNREGISTERED' },
  ];

  const kycRequestPayload: KycPremiumMemberHistoryListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    fullName: debouncedFilter.fullName,
    phoneNumber: debouncedFilter.phoneNumber,
    verificationDateFrom: stringToDateFormat(debouncedFilter.verificationDate.startDate),
    verificationDateTo: stringToDateFormat(debouncedFilter.verificationDate.endDate),
    status: debouncedFilter.status.map(data => data.value),
  };

  const {
    data: kycRequestData,
    status: kycRequestStatus,
    refetch: refetchKycRequest
  } = useQuery(
    ['kyc-request-list', kycRequestPayload],
    async () => await useKycPremiumMemberHistoryListFetcher(baseUrl, kycRequestPayload),
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

  const handleSort = (columnId: keyof KycPremiumMemberHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleDownload = async () => {
    const { result, error, errorData } = await useKycPremiumMemberDownloadFetcher(baseUrl);
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-kyc-request-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download kyc history failed!', { variant: 'error' });
    }
  };

  return {
    statusOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleDownload,
    kycRequestData: kycRequestData?.result?.data || [],
    kycRequestStatus,
    fetchKycRequestList: () => {
      refetchKycRequest();
    },
  };
}

export default useKycRequestHistoryList;
