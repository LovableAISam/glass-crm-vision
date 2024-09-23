// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useFeeSummaryExportFetcher, useFeeSummaryFetcher, } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { FeeSummaryRequest } from "@woi/service/co/admin/report/feeSummary";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { useSnackbar } from "notistack";
import { batch, reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { MemberData, } from "@woi/service/co/idp/member/memberList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";
import { MemberTransactionType } from "@woi/service/co/admin/report/membersummaryDetail";
import { useForm } from "react-hook-form";

type FilterForm = {
  activeDate: DatePeriod;
  transactionType: OptionMap<MemberTransactionType>[];
};

const initialFilterForm: FilterForm = {
  activeDate: {
    startDate: null,
    endDate: null,
  },
  transactionType: []
};

type FeeSummaryProps = {
  formatOption: string;
};

export interface FeeSummary {
  effectiveDate: DatePeriod;
}

const initialFeeSummary: FeeSummary = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useFeeSummaryList(props: FeeSummaryProps) {
  const { formatOption } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 50,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MemberData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const formData = useForm<FeeSummary>({
    defaultValues: initialFeeSummary,
  });
  const { handleSubmit, reset } = formData;

  const memberPayload: FeeSummaryRequest = {
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    transactionType: debouncedFilter.transactionType.map(data => data.value),
  };

  const {
    data: feeSummaryResult,
    status: feeSummaryStatus,
    refetch: refetchMember
  } = useQuery(
    ['fee-summary-list', memberPayload],
    async () => useFeeSummaryFetcher(baseUrl, memberPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.transactions && !response.error) {
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
      reset();
    });
  };

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
      label: 'Add Money',
      value: 'ADDMONEY, Add Money',
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

  const handleSort = (columnId: keyof MemberData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useFeeSummaryExportFetcher(baseUrl, {
      startAt: stringToDateFormat(effectiveDate.startDate),
      endAt: stringToDateFormat(effectiveDate.endDate),
      fileExtension: formatOption,
      sort: sortBy ? `${sortBy}:${direction}` : '',
      transactionType: debouncedFilter.transactionType.map(data => data.value)
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-fee-summary-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download fee summary failed!', { variant: 'error' });
    }
  });

  return {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    feeSummaryData: feeSummaryResult?.result?.transactions || [],
    feeSummaryStatus,
    fetchMemberList: () => {
      refetchMember();
    },
    transactionTypeOptions,
    handleExport,
    formData,
    handleDeleteFilter
  };
}

export default useFeeSummaryList;
