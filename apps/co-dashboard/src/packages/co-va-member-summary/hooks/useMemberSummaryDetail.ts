// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useMemberSummaryDetailFetcher,
  useMemberSummaryTransactionExportFetcher,
} from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { PaginationData } from "@woi/core/api";
import { MemberSummaryDetailRequest, MemberTransactionType } from "@woi/service/co/admin/report/membersummaryDetail";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { TransactionHistoryData } from "@woi/service/co/transaction/transactionHistory/transactionHistoryList";
import { MemberData, } from "@woi/service/co/idp/member/memberList";
import { OptionMap } from "@woi/option";

type FilterForm = {
  transactionDate: DatePeriod;
  transactionType: OptionMap<MemberTransactionType>[];
};

const initialFilterForm: FilterForm = {
  transactionDate: {
    startDate: null,
    endDate: null,
  },
  transactionType: []
};

type ActivityMemberHistoryListProps = {
  selectedData: MemberData;
  formatOption: string;
};

function useMemberSummaryDetail(props: ActivityMemberHistoryListProps) {
  const { selectedData, formatOption } = props;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();

  const transactionTypeOptions = <OptionMap<string>[]>([
    {
      label: 'Topup',
      value: 'Topup',
    },
    {
      label: 'Transfer Between Member',
      value: 'Transfer Between Member',
    },
    {
      label: 'Incoming P2P',
      value: 'Incoming P2P',
    },
    {
      label: 'Merchant Pay',
      value: 'Merchant Pay',
    },
    {
      label: 'Outgoing IBFT',
      value: 'Outgoing IBFT',
    },
    {
      label: 'Outgoing BPI',
      value: 'Outgoing BPI',
    },
    {
      label: 'Cash Withdrawal',
      value: 'Cash Withdrawal',
    },
    {
      label: 'Cardless Withdrawal',
      value: 'Cardless Withdrawal',
    },
    {
      label: 'Ecpay Pay Bills',
      value: 'Ecpay Pay Bills',
    },
    {
      label: 'Balance Correction',
      value: 'Balance Correction',
    },
  ]);

  const getSortPayload = (paramSortBy: keyof TransactionHistoryData) => {
    if (paramSortBy === 'date') return 'dateTime';
    if (paramSortBy === 'vaDest') return 'vaDestination';
    return paramSortBy;
  };

  const memberSummaryTransactionPayload: MemberSummaryDetailRequest = {
    page: pagination.currentPage,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    limit: pagination.limit,
    "end-date": stringToDateFormat(debouncedFilter.transactionDate.endDate),
    phoneNumber: selectedData?.phoneNumber || '',
    size: pagination.limit,
    "start-date": stringToDateFormat(debouncedFilter.transactionDate.startDate),
    transactionType: debouncedFilter.transactionType.map(data => data.value),
  };

  const {
    data: memberSummaryTransaction,
    status: memberSummaryTransactionStatus,
    refetch: refetchMemberSummaryTransaction
  } = useQuery(
    ['member-summary-list', memberSummaryTransactionPayload],
    async () => useMemberSummaryDetailFetcher(baseUrl, memberSummaryTransactionPayload),
    {
      enabled: Boolean(selectedData?.phoneNumber),
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.reports && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.reports.totalElements / pagination.limit),
            totalElements: result.reports.totalElements,
          }));
        } else {
          enqueueSnackbar(response?.displayMessage, { variant: 'error' });
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

  const handleSort = (columnId: keyof TransactionHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = async () => {
    const { result, error, errorData } = await useMemberSummaryTransactionExportFetcher(baseUrl, {
      fileExtension: formatOption,
      endAt: stringToDateFormat(debouncedFilter.transactionDate.endDate),
      phoneNumber: selectedData?.phoneNumber || '',
      sort: sortBy ? `${sortBy}:${direction}` : '',
      startAt: stringToDateFormat(debouncedFilter.transactionDate.startDate),
      transactionType: debouncedFilter.transactionType.map(data => data.value),
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-activity-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download activity history failed!', { variant: 'error' });
    }
  };


  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberSummaryTransaction: memberSummaryTransaction?.result?.reports?.transactions || [],
    memberSummaryDetail: memberSummaryTransaction?.result,
    memberSummaryTransactionStatus,
    fetchMemberSummaryTransaction: () => {
      refetchMemberSummaryTransaction();
    },
    transactionTypeOptions
  };
}

export default useMemberSummaryDetail;
