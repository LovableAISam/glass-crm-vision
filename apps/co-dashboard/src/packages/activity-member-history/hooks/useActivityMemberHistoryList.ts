// Cores
import { useState } from "react";

// Hooks & Utils
import {
  useActivityMemberHistoryExportFetcher,
  useMemberActivityListFetcher,
} from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { batch, reverseDirection } from "@woi/core";
import { MemberActivityData, MemberActivityListRequest } from "@woi/service/co/admin/report/memberActivityList";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { addDays } from "date-fns";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

type FilterForm = {
  account: string;
  transactionDate: DatePeriod;
  activityType: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  account: '',
  transactionDate: {
    startDate: null,
    endDate: null,
  },
  activityType: [],
};

type ActivityMemberHistoryProps = {
  formatOption: string;
};

export interface MemberHistory {
  effectiveDate: DatePeriod;
}

const initialMemberHistory: MemberHistory = {
  effectiveDate: {
    startDate: addDays(new Date(), -6),
    endDate: new Date(),
  },
};

function useActivityMemberHistoryList(props: ActivityMemberHistoryProps) {
  const { formatOption } = props;

  const formData = useForm<MemberHistory>({
    defaultValues: initialMemberHistory,
  });
  const { handleSubmit, reset } = formData;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MemberActivityData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCO } = useTranslation('co');


  const activityTypeOptions = <OptionMap<string>[]>([
    {
      label: "Attempt",
      value: 'Attempt',
    },
    {
      label: "Success",
      value: 'Success',
    },
    {
      label: "Failed",
      value: 'Failed',
    },
  ]);

  const getSortPayload = (paramSortBy: keyof MemberActivityData) => {
    switch (paramSortBy) {
      case 'activityId':
        return 'id';
      case 'createdDate':
        return 'dateTime';
      case 'referenceId':
        return 'refId';
      default:
        return paramSortBy;
    }
  };

  const memberActivityPayload: MemberActivityListRequest = {
    page: pagination.currentPage,
    size: pagination.limit,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    account: debouncedFilter.account,
    endAt: stringToDateFormat(debouncedFilter.transactionDate.endDate),
    startAt: stringToDateFormat(debouncedFilter.transactionDate.startDate),
    type: debouncedFilter.activityType.map(data => data.value),
  };

  const {
    data: memberActivityData,
    status: memberActivityStatus,
    refetch: refetchMemberActivity
  } = useQuery(
    ['member-acitivies', memberActivityPayload],
    async () => useMemberActivityListFetcher(baseUrl, memberActivityPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.activities && !response.error) {
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

  const handleSort = (columnId: keyof MemberActivityData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useActivityMemberHistoryExportFetcher(baseUrl, {
      sort: sortBy ? `${sortBy}:${direction}` : '',
      account: debouncedFilter.account,
      fileExtension: formatOption,
      startAt: stringToDateFormat(effectiveDate.startDate),
      endAt: stringToDateFormat(effectiveDate.endDate),
      type: debouncedFilter.activityType.map(data => data.value),
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-activity-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || tCO('downloadActivityMemberHistoryFailed'), { variant: 'error' });
    }
  });

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

  return {
    activityTypeOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberActivityData: memberActivityData?.result?.activities || [],
    memberActivityStatus,
    fetchMemberActivity: () => {
      refetchMemberActivity();
    },
    handleDeleteFilter,
    formData
  };
}

export default useActivityMemberHistoryList;
