// Cores
import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';

// Hooks & Utils
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from '@woi/common/hooks/useDebounce';
import { batch, Cookie, reverseDirection } from '@woi/core';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import {
  useAccountHistoryDetailFetcher,
  useAccountHistoryExportFetcher,
  useAccountHistoryPrintFetcher,
  useMerchantAccountHistoryFetcher,
  useRefundReasonListFetcher,
  useMerchantQRTypeListFetcher,
} from '@woi/service/co';
import {
  AccountHistoryDetailData,
  AccountHistoryDetailRequest,
} from '@woi/service/co/merchant/merchantAccountHistoryDetail';
import {
  MerchantAccountHistory,
  MerchantAccountHistoryRequest,
} from '@woi/service/co/merchant/merchantAccountHistoryList';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// Types & Consts
import { ckMerchantAccessToken } from "@woi/common/meta/cookieKeys";
import { PaginationData } from '@woi/core/api';
import { LONG_DATE_TIME_FORMAT_BE } from '@woi/core/utils/date/constants';
import { DatePeriod } from '@woi/core/utils/date/types';
import { getJwtData } from "@woi/core/utils/jwt/jwt";
import { OptionMap } from '@woi/option';
import useBaseMobileUrl from "@src/shared/hooks/useBaseUrlMobile";

export interface AccountHistoryFilter {
  effectiveDate: DatePeriod;
}

const initialMemberHistoryTransaction: AccountHistoryFilter = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

type FilterForm = {
  dbCr: OptionMap<string>[];
  transactionType: OptionMap<string>[];
  effectiveDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  dbCr: [],
  transactionType: [],
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

interface AccountHistoryListProps {
  showModalDetail: () => void;
}

function useAccountHistoryList(props: AccountHistoryListProps) {
  const { showModalDetail } = props;

  const { baseUrl } = useBaseUrl();
  const { baseMobileUrl } = useBaseMobileUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { merchantCode } = useCommunityOwner();

  const formData = useForm<AccountHistoryFilter>({
    defaultValues: initialMemberHistoryTransaction,
  });
  const { handleSubmit } = formData;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MerchantAccountHistory>();
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState<boolean>(false);
  const [formatOption, setFormatOption] = useState<string>('PDF');
  const [selectData, setSelectData] = useState<MerchantAccountHistory | null>(null);
  const [accountHistoryDetail, setAccountHistoryDetail] =
    useState<AccountHistoryDetailData | null>(null);
  const debouncedFilter = useDebounce(filterForm, 300);

  const accessToken = Cookie.get(ckMerchantAccessToken);

  const authDetail = useMemo(() => {
    if (accessToken === undefined) return null;
    return getJwtData(accessToken);
  }, [accessToken]);

  const dbCrOptions = <OptionMap<string>[]>[
    {
      label: 'Debit',
      value: 'DEBIT',
    },
    {
      label: 'Credit',
      value: 'CREDIT',
    },
  ];

  const handleSort = (columnId: keyof MerchantAccountHistory) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

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
    });
  };

  const { data: qrTypeData } = useQuery(
    ['qris-type-list'],
    async () =>
      useMerchantQRTypeListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const qrTypeOptions: OptionMap<string>[] = useMemo(() => {
    if (!qrTypeData?.result) return backupTransactionType;
    return qrTypeData.result?.qrType.map(key => ({
      label: key,
      value: key,
    }));
  }, [qrTypeData]);

  const { data: refundReasonTypeData } = useQuery(
    ['refund-reason-type-list'],
    async () => useRefundReasonListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const refundReasonTypeOptions = useMemo(() => {
    if (!refundReasonTypeData?.result?.refundReasonList)
      return backupTransactionType;
    return refundReasonTypeData.result?.refundReasonList.map(key => ({
      label: key.reason,
      value: key.id,
    }));
  }, [refundReasonTypeData]);

  const accountHistoryPayload: MerchantAccountHistoryRequest = {
    'merchant code': merchantCode,
    'Start Date': stringToDateFormat(debouncedFilter.effectiveDate.startDate),
    'End Date': stringToDateFormat(debouncedFilter.effectiveDate.endDate),
    'qris type': debouncedFilter.transactionType.map(data => data.value),
    'debit credit': debouncedFilter?.dbCr?.map(data => data.value),
    limit: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
  };

  const { data: accountHistoryResult, status: accountHistoryStatus } = useQuery(
    ['transaction-list', accountHistoryPayload],
    async () =>
      useMerchantAccountHistoryFetcher(baseMobileUrl, accountHistoryPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: response => {
        const result = response.result;
        if (result && result.data && !response.error) {
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
      },
    },
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchAccountHistoryDetail = async (id: string) => {
    const accountHistoryDetailPayload: AccountHistoryDetailRequest = {
      id: id,
    };
    setLoading(true);
    const detailResponse = await useAccountHistoryDetailFetcher(baseMobileUrl, accountHistoryDetailPayload);
    const { result: resultDetail, error: errorDetail } = detailResponse;
    if (resultDetail?.details) {
      showModalDetail();
      setAccountHistoryDetail(resultDetail.details[0]);
    } else {
      enqueueSnackbar(errorDetail?.message, { variant: 'info' });
    }
    setLoading(false);
  };

  const fetchAccountHistoryPrint = async (data: MerchantAccountHistory) => {
    const { result, error, errorData } = await useAccountHistoryPrintFetcher(baseMobileUrl,
      {
        account_history_id: data.id,
        referral_number: data.referenceNumber,
      },
    );
    if (result && !error) {
      let link = document.createElement('a');
      link.download = `account-history-receipt-${stringToDateFormat(
        new Date(),
        LONG_DATE_TIME_FORMAT_BE,
      )}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(
        errorData?.message || errorData?.status?.text || 'Download account history failed!',
        { variant: 'error' },
      );
    }
  };

  const handleExport = handleSubmit(async form => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useAccountHistoryExportFetcher(
      baseUrl,
      {
        merchantCode: merchantCode,
        'End Date': stringToDateFormat(effectiveDate.endDate),
        'Start Date': stringToDateFormat(effectiveDate.startDate),
        fileExtension: formatOption,
        sort: sortBy ? `${sortBy}:${direction}` : '',
        'qris type': debouncedFilter.transactionType.map(
          data => data.value,
        ),
      },
    );
    if (result && !error) {
      let link = document.createElement('a');
      link.download = `export-account-history-${stringToDateFormat(
        new Date(),
        LONG_DATE_TIME_FORMAT_BE,
      )}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(
        errorData?.details?.[0] || 'Download account history failed!',
        { variant: 'error' },
      );
    }
  });

  return {
    refundReasonTypeOptions,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    accountHistoryData: accountHistoryResult?.result?.data || [],
    merchantCode: authDetail?.merchantCode || 'Merchant Account Binding',
    accountHistoryStatus,
    qrTypeOptions,
    dbCrOptions,
    handleExport,
    handleDeleteFilter,
    formData,
    formatOption,
    setFormatOption,
    filterForm,
    setFilterForm,
    iframeRef,
    loading,
    accountHistoryDetail,
    fetchAccountHistoryPrint,
    fetchAccountHistoryDetail,
    setSelectData,
    selectData
  };
};

const backupTransactionType = [
  {
    label: 'Biller BPJS',
    value: 'BILLER_BPJS',
  },
  {
    label: 'Biller Data',
    value: 'BILLER_DATA_PACKAGE',
  },
  {
    label: 'Biller PDAM',
    value: 'BILLER_PDAM',
  },
  {
    label: 'Biller PLN Postpaid',
    value: 'BILLER_PLN_POSTPAID',
  },
  {
    label: 'Biller PLN Prepaid',
    value: 'BILLER_PLN_PREPAID',
  },
  {
    label: 'Biller Pulsa Postpaid',
    value: 'BILLER_PULSA_POSTPAID',
  },
  {
    label: 'Biller Pulsa Prepaid',
    value: 'BILLER_PULSA_PREPAID',
  },
  {
    label: 'Cash Out',
    value: 'CASHOUT_TO_BANK',
  },
  {
    label: 'Cash Withdrawal',
    value: 'WITHDRAWAL',
  },
  {
    label: 'Change Email',
    value: 'CHANGE_EMAIL',
  },
  {
    label: 'delete this tes',
    value: 'delete_this_later',
  },
  {
    label: 'KYC',
    value: 'KYC',
  },
  {
    label: 'KYC Reject',
    value: 'KYC_REJECT',
  },
  {
    label: 'KYC Verified',
    value: 'KYC',
  },
  {
    label: 'Maximum Balance',
    value: 'MAX_BALANCE',
  },
  {
    label: 'Member Register',
    value: 'MEMBER_REGISTER',
  },
  {
    label: 'Redeem Rewards',
    value: 'LOYALTY_REDEEM',
  },
  {
    label: 'Request Money',
    value: 'REQUEST_MONEY',
  },
  {
    label: 'Reset Password',
    value: 'RESET_PASSWORD',
  },
  {
    label: 'Scan to Pay',
    value: 'SCAN_TO_PAY',
  },
  {
    label: 'Send Money',
    value: 'SEND_MONEY',
  },
  {
    label: 'test',
    value: 'TESTER',
  },
  {
    label: 'tester',
    value: 'TEST',
  },
  {
    label: 'TOP UP',
    value: 'TOP_UP',
  },
  {
    label: 'Transaction Per Day',
    value: 'TRX_PER_DAY',
  },
  {
    label: 'Transaction Per Month',
    value: 'TRX_PER_MONTH',
  },
  {
    label: 'Welcome Vybe Lite',
    value: 'WELCOMEVYBEELITE',
  },
];

export default useAccountHistoryList;
