// Cores
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks & Utils
import { useQRISReportFetcher } from '@woi/service/co';
import { reverseDirection } from '@woi/core';

// Types & Consts
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';
import { QRISReport } from '@woi/service/co/admin/report/qrisReport';
import useBaseMobileUrl from "@src/shared/hooks/useBaseUrlMobile";
import { QRISReportDetailRequest } from "@woi/service/co/admin/report/qrisReportDetail";

type QRISReportDetailsProps = {
  selectedData: QRISReport;
};

function useQRISReportDetail(props: QRISReportDetailsProps) {
  const { selectedData } = props;
  const [sortBy, setSortBy] = useState<keyof TransactionHistoryData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const { baseMobileUrl } = useBaseMobileUrl();

  const qrisReportDetailPayload: QRISReportDetailRequest = {
    transactionId: selectedData.transactionNumber,
  };

  const {
    data: qrisReportDetailData,
    status: qrisReportDetailStatus,
    refetch: refetchQRISReportDetail,
  } = useQuery(['qris-report-detail', qrisReportDetailPayload],
    async () => useQRISReportFetcher(baseMobileUrl, qrisReportDetailPayload), { refetchOnWindowFocus: false });

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
