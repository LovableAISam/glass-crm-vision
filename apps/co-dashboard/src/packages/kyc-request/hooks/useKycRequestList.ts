// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useKycPremiumMemberListFetcher } from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useTranslation } from "react-i18next";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { KycPremiumMemberData, KycPremiumMemberListRequest, KycPremiumMemberStatus } from "@woi/service/co/kyc/premiumMember/premiumMemberList";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";

type FilterForm = {
  memberName: string;
  phoneNumber: string;
  requestDate: DatePeriod;
  status: OptionMap<KycPremiumMemberStatus>[];
};

const initialFilterForm: FilterForm = {
  memberName: '',
  phoneNumber: '',
  requestDate: {
    startDate: null,
    endDate: null,
  },
  status: [],
};

function useKycRequestList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof KycPremiumMemberData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { t: tCO } = useTranslation('co');
  const statusOptions: OptionMap<KycPremiumMemberStatus>[] = [
    { label: tCO('approve'), value: 'REGISTERED' },
    { label: tCO('rejected'), value: 'REJECTED' },
    { label: tCO('waitingToVerify'), value: 'WAITING_TO_REVIEW' },
  ];

  const kycRequestPayload: KycPremiumMemberListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    memberName: debouncedFilter.memberName,
    phoneNumber: debouncedFilter.phoneNumber,
    requestDateFrom: stringToDateFormat(debouncedFilter.requestDate.startDate),
    requestDateTo: stringToDateFormat(debouncedFilter.requestDate.endDate),
    status: debouncedFilter.status.map(data => data.value),
  };

  const {
    data: kycRequestData,
    status: kycRequestStatus,
    refetch: refetchKycRequest
  } = useQuery(
    ['kyc-request-list', kycRequestPayload],
    async () => useKycPremiumMemberListFetcher(baseUrl, kycRequestPayload),
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

  const handleSort = (columnId: keyof KycPremiumMemberData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const fetchKycRequestList = () => {
    refetchKycRequest();
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
    kycRequestData: kycRequestData?.result?.data || [],
    kycRequestStatus,
    fetchKycRequestList,
  };
}

export default useKycRequestList;
