// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import {
  useTransactionSummaryDetailFetcher,
} from "@woi/service/co";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { TransactionHistoryData } from "@woi/service/co/transaction/transactionHistory/transactionHistoryList";
import { TransactionSummaryData, } from "@woi/service/co/transaction/transactionSummary/transactionSummaryList";
import { TransactionSummaryDetailRequest } from "@woi/service/co/admin/report/transactionSummaryDetail";

type TransactionSummaryDetailsProps = {
  selectedData: TransactionSummaryData;
};

function useTransactionSummaryDetail(props: TransactionSummaryDetailsProps) {
  const { selectedData } = props;
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const { baseUrl } = useBaseUrl();

  const TransactionSummaryDetailPayload: TransactionSummaryDetailRequest = {
    id: selectedData.transactionHistoryId,
  };

  const {
    data: transactionSummaryData,
    status: transactionSummaryStatus,
    refetch: refetchTransactionSummaryDetail
  } = useQuery(
    ['transaction-summary-list', TransactionSummaryDetailPayload],
    async () => useTransactionSummaryDetailFetcher(baseUrl, TransactionSummaryDetailPayload),
    {
      refetchOnWindowFocus: false,

    }
  );

  const handleSort = (columnId: keyof TransactionHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };


  return {
    sortBy,
    direction,
    handleSort,
    transactionSummaryData: transactionSummaryData?.result?.searchResult || [],
    transactionSummaryDetail: transactionSummaryData?.result,
    transactionSummaryStatus,
    fetchTransactionSummaryDetail: () => {
      refetchTransactionSummaryDetail();
    },
  };
}

export default useTransactionSummaryDetail;
