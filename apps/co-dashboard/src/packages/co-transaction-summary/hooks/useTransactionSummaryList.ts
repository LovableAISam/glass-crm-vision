// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useTransactionSummaryExportFetcher, useTransactionSummaryFetcher } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useTranslation } from "react-i18next";
import { TransactionSummaryRequest, UpgradeStatus, TransactionSummaryData, TransactionType } from "@woi/service/co/transaction/transactionSummary/transactionSummaryList";
import { useSnackbar } from "notistack";
import { batch, reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { useForm } from "react-hook-form";

type FilterForm = {
  upgradeStatus: OptionMap<UpgradeStatus>[];
  activeDate: DatePeriod;
  transactionType: OptionMap<TransactionType>[];
  bank: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  upgradeStatus: [],
  activeDate: {
    startDate: null,
    endDate: null,
  },
  transactionType: [],
  bank: []
};

export interface TransactionSummary {
  effectiveDate: DatePeriod;
}

const initialTransactionSummary: TransactionSummary = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

type TransactionSummaryProps = {
  formatOption: string;
};

function useTransactionSummaryList(props: TransactionSummaryProps) {
  const { formatOption } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { t: tReport } = useTranslation('report');

  const formData = useForm<TransactionSummary>({
    defaultValues: initialTransactionSummary,
  });
  const { handleSubmit, reset } = formData;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof TransactionSummaryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);

  const upgrageStatusOptions = <OptionMap<UpgradeStatus>[]>([
    {
      label: tReport('upgradeStatusNotUpgrade'),
      value: 'NOT_UPGRADE',
    },
    {
      label: tReport('upgradeStatusUpgrade'),
      value: 'UPGRADE',
    },
  ]);

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

  const transactionPayload: TransactionSummaryRequest = {
    endAt: stringToDateFormat(debouncedFilter.activeDate.endDate),
    startAt: stringToDateFormat(debouncedFilter.activeDate.startDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    status: debouncedFilter.upgradeStatus.map(data => data.value),
    transactionType: debouncedFilter.transactionType.map(data => data.value),
  };

  const {
    data: transactionData,
    status: transactionSummaryStatus,
  } = useQuery(
    ['transaction-list', transactionPayload],
    async () => useTransactionSummaryFetcher(baseUrl, transactionPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.transactions && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalPages),
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

  const handleSort = (columnId: keyof TransactionSummaryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useTransactionSummaryExportFetcher(baseUrl, {
      startAt: stringToDateFormat(effectiveDate.startDate),
      endAt: stringToDateFormat(effectiveDate.endDate),
      fileExtension: formatOption,
      sort: sortBy ? `${sortBy}:${direction}` : '',
      status: debouncedFilter.upgradeStatus.map(data => data.value),
      transactionType: debouncedFilter.transactionType.map(data => data.value)
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-fee-summary-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download transaction summary failed!', { variant: 'error' });
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
    transactionSummaryData: transactionData?.result?.transactions || [],
    transactionSummaryStatus,
    transactionTypeOptions,
    upgrageStatusOptions,
    handleExport,
    handleDeleteFilter,
    formData
  };
}

export default useTransactionSummaryList;
