// Cores
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks & Utils
import { useTransactionSummaryDetailFetcher } from '@woi/service/co';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { reverseDirection } from '@woi/core';

// Types & Consts
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';
//import { TransactionSummaryData } from '@woi/service/co/transaction/transactionSummary/transactionSummaryList';
//import { TransactionSummaryDetailRequest } from '@woi/service/co/admin/report/transactionSummaryDetail';
import {
  QRISReport,
  ResponseDataQRISReport,
} from '@woi/service/co/admin/report/qrisReport';

type QRISReportDetailsProps = {
  selectedData: QRISReport;
};

function useQRISReportDetail(props: QRISReportDetailsProps) {
  const { selectedData } = props;
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const { baseUrl } = useBaseUrl();

  const qrisReportDetailPayload: ResponseDataQRISReport = {
    id: selectedData.transactionNumber,
    data: [],
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
  };

  const {
    data: qrisReportDetailData,
    status: qrisReportDetailStatus,
    refetch: refetchQRISReportDetail,
  } = useQuery(
    ['qris-report-detail', qrisReportDetailPayload],
    async () =>
      useTransactionSummaryDetailFetcher(baseUrl, qrisReportDetailPayload),
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
    qrisReportDetailData: qrisReportDetailData?.result?.detail || [],
    transactionSummaryDetail: qrisReportDetailData?.result,
    qrisReportDetailStatus,
    fetchQRISReportDetail: () => {
      refetchQRISReportDetail();
    },
  };
}

export default useQRISReportDetail;
