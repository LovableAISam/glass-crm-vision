// Cores
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Hooks & Utils
import useDebounce from "@woi/common/hooks/useDebounce";
import { reverseDirection } from "@woi/core";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import {
  useMerchantTransactionHistoryDetailFetcher,
  useMerchantTransactionHistoryExport,
  useMerchantTransactionHistoryListFetcher,
  useMerchantTransactionHistoryPrint,
} from "@woi/service/co";
import { MerchantTransactionHistoryData, MerchantTransactionHistoryListRequest } from "@woi/service/co/merchant/merchantTransactionHistoryList";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";
import { DatePeriod } from "@woi/core/utils/date/types";
import useBaseMobileUrl from "@src/shared/hooks/useBaseUrlMobile";
import useModal from "@woi/common/hooks/useModal";

export interface MemberHistoryTransaction {
  effectiveDate: DatePeriod;
}

const initialMemberHistoryTransaction: MemberHistoryTransaction = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

type TransactionHistoryListProps = {
  merchantCode?: string;
  selectedOption?: string;
};

function useTransactionHistoryList(props: TransactionHistoryListProps) {
  const { merchantCode, selectedOption } = props;

  const formData = useForm<MemberHistoryTransaction>({
    defaultValues: initialMemberHistoryTransaction,
  });
  const { handleSubmit, getValues } = formData;

  const { baseMobileUrl } = useBaseMobileUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');
  const [isActiveDetailTrx, showModalDetailTrx, hideModalDetailTrx] = useModal();

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MerchantTransactionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const debouncedFilter = useDebounce(getValues('effectiveDate'), 300);
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);
  const [detailTrx, setDetailTrx] = useState<MerchantTransactionHistoryData | null>(null);

  const transactionHistoryPayload: MerchantTransactionHistoryListRequest = {
    'merchant code': merchantCode,
    'Start Date': stringToDateFormat(debouncedFilter.startDate),
    'End Date': stringToDateFormat(debouncedFilter.endDate),
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const {
    data: transactionHistoryData,
    status: transactionHistoryStatus,
  } = useQuery(
    ['merchant-trasaction-history', transactionHistoryPayload],
    async () => useMerchantTransactionHistoryListFetcher(baseMobileUrl, transactionHistoryPayload),
    {
      enabled: Boolean(merchantCode) && !(calculateDateRangeDays(getValues('effectiveDate.startDate'), getValues('effectiveDate.endDate')) > 730),
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

  const fetchTransactionMerchantDetail = async (id: string) => {
    const { result, error } = await useMerchantTransactionHistoryDetailFetcher(baseMobileUrl, { id });
    if (result && !error) {
      setDetailTrx(result);
      showModalDetailTrx();
    } else {
      enqueueSnackbar(error?.message || `Get Detail Merchant failed!`, { variant: 'error' });
    }
  };

  const handleSort = (columnId: keyof MerchantTransactionHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handlePrint = async (id: string) => {
    setIsLoadingDownload(true);
    const { result, error, errorData } = await useMerchantTransactionHistoryPrint(baseMobileUrl, { id: id });

    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-merchant-transaction-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Download transaction history failed!', { variant: 'error' });
    }
    setIsLoadingDownload(false);
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;

    if (calculateDateRangeDays(effectiveDate.startDate, effectiveDate.endDate) >
      90) {
      enqueueSnackbar(tCommon('labelMaxDownloadExceed'), { variant: 'error' });
    } else if (pagination.totalElements > 100) {
      enqueueSnackbar(tCommon('labelMaxCountDownloadExceed'), { variant: 'error' });
    } else {
      setIsLoadingDownload(true);
      const { result, error, errorData } = await useMerchantTransactionHistoryExport(baseMobileUrl, {
        merchantCode: merchantCode,
        page: pagination.currentPage,
        sort: sortBy ? `${sortBy}:${direction}` : '',
        'Start Date': stringToDateFormat(effectiveDate.startDate),
        'End Date': stringToDateFormat(effectiveDate.endDate),
        fileExtension: selectedOption
      });

      if (result && !error) {
        let link = document.createElement("a");
        link.download = `export-merchant-transaction-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
        link.href = result.url;
        link.click();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || 'Download transaction history failed!', { variant: 'error' });
      }
      setIsLoadingDownload(false);
    }
  });

  return {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    transactionHistoryData: transactionHistoryData?.result?.transactions || [],
    transactionHistoryStatus,
    formData,
    isLoadingDownload,
    fetchTransactionMerchantDetail,
    detailTrx,
    isActiveDetailTrx,
    hideModalDetailTrx,
    showModalDetailTrx,
    handlePrint,
    setDetailTrx
  };
}

export default useTransactionHistoryList;
