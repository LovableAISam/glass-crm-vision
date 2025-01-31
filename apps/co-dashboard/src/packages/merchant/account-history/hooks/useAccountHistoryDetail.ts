// Cores
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks & Utils
import { useTransactionSummaryDetailFetcher } from '@woi/service/co';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { reverseDirection } from '@woi/core';

// Types & Consts
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';
import { TransactionSummaryDetailRequest } from '@woi/service/co/admin/report/transactionSummaryDetail';
import { MerchantAccountHistory } from '@woi/service/co/merchant/merchantAccountHistoryList';

type TransactionSummaryDetailsProps = {
  selectedData: MerchantAccountHistory;
};

function useAccountHistoryDetail(props: TransactionSummaryDetailsProps) {
  const { selectedData } = props;
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const { baseUrl } = useBaseUrl();

  const accountHisotryDetailPayload: TransactionSummaryDetailRequest = {
    id: selectedData.id,
  };

  const {
    data: accountHisotryDetailData,
    status: accountHisotryDetailStatus,
    refetch: refetchTransactionSummaryDetail,
  } = useQuery(
    ['account-history-detail', accountHisotryDetailPayload],
    async () =>
      useTransactionSummaryDetailFetcher(baseUrl, accountHisotryDetailPayload),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleSort = (columnId: keyof TransactionHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    sortBy,
    direction,
    handleSort,
    accountHisotryDetailData: accountHisotryDetailData?.result?.detail || [],
    transactionSummaryDetail: accountHisotryDetailData?.result,
    accountHisotryDetailStatus,
    fetchTransactionSummaryDetail: () => {
      refetchTransactionSummaryDetail();
    },
  };
}

export default useAccountHistoryDetail;
