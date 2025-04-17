// Cores
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks & Utils
import {
  useQRISReportListFetcher,
  useKycListFetcher,
  useMerchantCriteriaListFetcher,
  useMerchantQRISTypeListFetcher,
  useMerchantLocationListFetcher,
  useMerchantCategoryCodeListFetcher,
  useQRISReportExportFetcher,
  useMerchantQRTypeListFetcher,
} from '@woi/service/co';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from '@woi/common/hooks/useDebounce';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { QRISReportRequest } from '@woi/service/co/admin/report/qrisReport';
import { batch, reverseDirection } from '@woi/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useBaseMobileUrl from "@src/shared/hooks/useBaseUrlMobile";

// Types & Consts
import { PaginationData } from '@woi/core/api';
import { OptionMap } from '@woi/option';
import { DatePeriod } from '@woi/core/utils/date/types';
import { LONG_DATE_TIME_FORMAT_BE } from '@woi/core/utils/date/constants';

type FilterForm = {
  endAt: DatePeriod;
  transactionType: OptionMap<string>[];
  qrType: OptionMap<string>[];
  qrisType: OptionMap<string>[];
  qrisLocation: OptionMap<string>[];
  kycLocation: OptionMap<string>[];
  merchantCategoryCode: OptionMap<string>[];
  merchantCriteria: OptionMap<string>[];
  merchantName: string;
};

const initialFilterForm: FilterForm = {
  endAt: {
    startDate: null,
    endDate: null,
  },
  transactionType: [],
  qrType: [],
  qrisType: [],
  qrisLocation: [],
  kycLocation: [],
  merchantCategoryCode: [],
  merchantCriteria: [],
  merchantName: '',
};

type TransactionSummaryProps = {
  formatOption: string;
};

export interface COTransactionSummaryFilter {
  effectiveDate: DatePeriod;
}

const initialCOTransactionSummary: COTransactionSummaryFilter = {
  effectiveDate: {
    startDate: null,
    endDate: null,
  },
};

function useQRISReportList(props: TransactionSummaryProps) {
  const { formatOption } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof QRISReportRequest>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const { baseMobileUrl } = useBaseMobileUrl();
  const debouncedFilter = useDebounce(filterForm, 300);
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);

  const formData = useForm<COTransactionSummaryFilter>({
    defaultValues: initialCOTransactionSummary,
  });

  const { handleSubmit } = formData;

  //Get data for dropdown KYC
  const { data: KycListTypeData } = useQuery(
    ['kyc-type-list'],
    async () => useKycListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const kycTypeOptions = useMemo(() => {
    if (!KycListTypeData || !Array.isArray(KycListTypeData.result)) return [];
    return KycListTypeData.result.map(key => ({
      label: key.cityName,
      value: key.cityId,
    }));
  }, [KycListTypeData]);

  //Get data for Merchant Criteria dropdown
  const { data: MerchantCriteriaListTypeData } = useQuery(
    ['merchant-criteria-type-list'],
    async () => useMerchantCriteriaListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const merchantCriteriaTypeOptions = useMemo(() => {
    if (
      !MerchantCriteriaListTypeData ||
      !Array.isArray(MerchantCriteriaListTypeData.result)
    )
      return [];
    return MerchantCriteriaListTypeData.result.map(key => ({
      label:
        key.code === '' ? key.definition : `${key.definition} (${key.code})`,
      value: key.code,
    }));
  }, [MerchantCriteriaListTypeData]);

  //Get data for QR Type dropdown
  const { data: QrListTypeData } = useQuery(
    ['qr-type-list'],
    async () => useMerchantQRTypeListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const qrTypeOptions: OptionMap<string>[] = useMemo(() => {
    const defaultOptions: OptionMap<string>[] = [];
    if (
      !QrListTypeData ||
      !Array.isArray(QrListTypeData?.result?.qrType) ||
      !QrListTypeData?.result?.qrType?.length
    ) {
      return defaultOptions;
    }
    return QrListTypeData?.result?.qrType?.map(qrType => ({
      label: qrType,
      value: qrType,
    }));
  }, [QrListTypeData]);

  //Get data for QRIS Type dropdown
  const { data: QrisListTypeData } = useQuery(
    ['qris-type-list'],
    async () => useMerchantQRISTypeListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const qrisTypeOptions: OptionMap<string>[] = useMemo(() => {
    const defaultOptions: OptionMap<string>[] = [];
    if (
      !QrisListTypeData ||
      !Array.isArray(QrisListTypeData?.result?.qrisType) ||
      !QrisListTypeData?.result?.qrisType.length
    ) {
      return defaultOptions;
    }

    return QrisListTypeData?.result?.qrisType?.map(qrisType => ({
      label: qrisType,
      value: qrisType,
    }));
  }, [QrisListTypeData]);

  //Get data for QR Location Type dropdown
  const { data: QrLocationListTypeData } = useQuery(
    ['qr-location-type-list'],
    async () => useMerchantLocationListFetcher(baseUrl),
    { refetchOnWindowFocus: false },
  );

  const qrLocationTypeOptions: OptionMap<string>[] = useMemo(() => {
    const defaultOptions: OptionMap<string>[] = [];
    if (
      !QrLocationListTypeData ||
      !Array.isArray(QrLocationListTypeData.result?.merchantLocationList) ||
      !QrLocationListTypeData.result?.merchantLocationList.length
    ) {
      return defaultOptions;
    }
    return QrLocationListTypeData.result.merchantLocationList.map(location => ({
      label: location.name,
      value: location.id,
    }));
  }, [QrLocationListTypeData]);

  //Get Data For Merchant Code Type Dropdown
  const payload = {
    pageNumber: 0,
    pageSize: 1000,
  };

  const { data: MerchantCategoryCodeRequest } = useQuery(
    ['merchant-category-code-list'],
    async () => useMerchantCategoryCodeListFetcher(baseUrl, payload),
    { refetchOnWindowFocus: false },
  );

  const merchantCategoryTypeOptions: OptionMap<string>[] = useMemo(() => {
    if (
      !MerchantCategoryCodeRequest ||
      !MerchantCategoryCodeRequest.result?.mccList?.length
    ) {
      return [];
    }
    return MerchantCategoryCodeRequest.result.mccList.map(category => ({
      label: category.description,
      value: category.mcc,
    }));
  }, [MerchantCategoryCodeRequest]);

  const qrisReportPayload: QRISReportRequest = {
    startAt: stringToDateFormat(debouncedFilter.endAt.startDate),
    endAt: stringToDateFormat(debouncedFilter.endAt.endDate),
    size: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    transactionType: debouncedFilter.transactionType.map(data => data.value),
    qrType: debouncedFilter.qrType.map(data => data.value),
    qrisType: debouncedFilter.qrisType.map(data => data.value),
    qrisLocation: debouncedFilter.qrisLocation.map(data => data.label),
    kycLocation: debouncedFilter.kycLocation.map(data => data.label),
    merchantCategoryCode: debouncedFilter.merchantCategoryCode.map(
      data => data.value,
    ),
    merchantCriteria: debouncedFilter.merchantCriteria.map(data => data.value),
    merchantName: debouncedFilter.merchantName
      ? debouncedFilter.merchantName
      : '',
  };

  const {
    data: qrisReportData,
    status: qrisReportStatus,
    refetch: refetchQRISReport,
  } = useQuery(
    ['transaction-list', qrisReportPayload],
    async () => useQRISReportListFetcher(baseMobileUrl, qrisReportPayload),
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

  const handleSort = (columnId: keyof QRISReportRequest) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async form => {
    const { effectiveDate } = form;

    if (
      calculateDateRangeDays(effectiveDate.startDate, effectiveDate.endDate) >
      90
    ) {
      enqueueSnackbar(tCommon('labelMaxDownloadExceed'), { variant: 'error' });
    } else if (pagination.totalElements > 100) {
      enqueueSnackbar(tCommon('labelMaxCountDownloadExceed'), {
        variant: 'error',
      });
    } else {
      setIsLoadingDownload(true);
      const { result, error, errorData } = await useQRISReportExportFetcher(
        baseMobileUrl,
        {
          startDate: stringToDateFormat(effectiveDate.startDate),
          endDate: stringToDateFormat(effectiveDate.endDate),
          format: formatOption,
          sort: sortBy ? `${sortBy}:${direction}` : '',
          merchantName: debouncedFilter.merchantName
            ? debouncedFilter.merchantName
            : '',
          transactionType: debouncedFilter.transactionType.map(
            data => data.value,
          ),
          qrType: debouncedFilter.qrType.map(data => data.value),
          qrisType: debouncedFilter.qrisType.map(data => data.value),
          kycLocation: debouncedFilter.kycLocation.map(data => data.value),
          merchantCategoryCode: debouncedFilter.merchantCategoryCode.map(
            data => data.value,
          ),
          merchantCriteria: debouncedFilter.merchantCriteria.map(
            data => data.value,
          ),
          qrisLocation: debouncedFilter.qrisLocation.map(data => data.value),
        },
      );
      if (result && !error) {
        let link = document.createElement('a');
        link.download = `export-fee-summary-${stringToDateFormat(
          new Date(),
          LONG_DATE_TIME_FORMAT_BE,
        )}.xls`;
        link.href = result.url;
        link.click();
      } else {
        enqueueSnackbar(
          errorData?.details?.[0] || 'Download transaction summary failed!',
          { variant: 'error' },
        );
      }
      setIsLoadingDownload(false);
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
    qrisReportData: qrisReportData?.result?.data || [],
    qrisReportStatus,
    kycTypeOptions,
    merchantCriteriaTypeOptions,
    qrLocationTypeOptions,
    qrTypeOptions,
    qrisTypeOptions,
    merchantCategoryTypeOptions,
    handleDeleteFilter,
    handleExport,
    fetchTransactionList: () => {
      refetchQRISReport();
    },
    formData,
    isLoadingDownload,
  };
}

export default useQRISReportList;
