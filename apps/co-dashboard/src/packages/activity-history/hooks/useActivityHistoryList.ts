// Cores
import { useState } from "react";

// Hooks & Utils
import {
  useActivityAdminHistoryExportFetcher,
  useAdminActivityListFetcher,
} from "@woi/service/co";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { batch, reverseDirection } from "@woi/core";
import { useQuery } from "@tanstack/react-query";
import { AdminActivityData, AdminActivityListRequest } from "@woi/service/co/admin/report/adminActivityList";
import { useForm } from "react-hook-form";
import { addDays } from "date-fns";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

type FilterForm = {
  fromUser: string;
  toUser: string;
  date: DatePeriod;
  type: OptionMap<string>[];
};

const initialFilterForm: FilterForm = {
  fromUser: '',
  toUser: '',
  date: {
    startDate: null,
    endDate: null,
  },
  type: [],
};

type ActivityHistoryProps = {
  formatOption: string;
};

export interface ActivityHistory {
  effectiveDate: DatePeriod;
}

const initialActivityHistory: ActivityHistory = {
  effectiveDate: {
    startDate: addDays(new Date(), -6),
    endDate: new Date(),
  },
};

function useActivityHistoryList(props: ActivityHistoryProps) {
  const { formatOption } = props;

  const formData = useForm<ActivityHistory>({
    defaultValues: initialActivityHistory,
  });
  const { handleSubmit, reset } = formData;

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof AdminActivityData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCO } = useTranslation('co');

  const activityTypeOptions = <OptionMap<string>[]>([
    {
      label: "Login",
      value: 'Login',
    },
    {
      label: "User Maintenance",
      value: 'User Maintenance',
    },
    {
      label: "Member Management",
      value: 'Member Management',
    },
    {
      label: "Activity Member History",
      value: 'Activity Member History',
    },
    {
      label: "Activity Admin History",
      value: 'Activity Admin History',
    },
    {
      label: "User Management",
      value: 'User Management',
    },
    {
      label: "Role Management",
      value: 'Role Management',
    },
    {
      label: "Account Rule Value Management",
      value: 'Account Rule Value Management',
    },
    {
      label: "System Parameter",
      value: 'System Parameter',
    },
    {
      label: "Email Management",
      value: 'Email Management',
    },
    {
      label: "SMS Management",
      value: 'SMS Management',
    },
    {
      label: "CO Transaction Summary",
      value: 'CO Transaction Summary',
    },
    {
      label: "CO VA Summary",
      value: 'CO VA Summary',
    },
    {
      label: "Fee Member Summary",
      value: 'Fee Member Summary',
    },
    {
      label: "Channel Realibility",
      value: 'Channel Realibility',
    },
    {
      label: "Fund Balance",
      value: 'Fund Balance',
    },
  ]);

  const getSortPayload = (paramSortBy: keyof AdminActivityData) => {
    const sortMap: Record<keyof AdminActivityData, string> = {
      activityId: 'id',
      dateTime: 'dateTime',
      description: 'description',
      fromUser: 'fromUser',
      status: 'status',
      toUser: 'toUser',
      type: 'type',
    };

    return sortMap[paramSortBy] || paramSortBy;
  };

  const adminActivityPayload: AdminActivityListRequest = {
    page: pagination.currentPage,
    size: pagination.limit,
    fromUser: debouncedFilter.fromUser,
    toUser: debouncedFilter.toUser,
    sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
    endAt: stringToDateFormat(debouncedFilter.date.endDate),
    startAt: stringToDateFormat(debouncedFilter.date.startDate),
    type: debouncedFilter.type.map(data => data.value),
  };

  const {
    data: adminActivityData,
    status: adminActivityStatus,
    refetch: refetchAdminActivity
  } = useQuery(
    ['admin-acitivies', adminActivityPayload],
    async () => useAdminActivityListFetcher(baseUrl, adminActivityPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const { result } = response;
        if (result?.transactions && !response.error) {
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

  const handleSort = (columnId: keyof AdminActivityData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleExport = handleSubmit(async (form) => {
    const { effectiveDate } = form;
    const { result, error, errorData } = await useActivityAdminHistoryExportFetcher(baseUrl, {
      fromUser: debouncedFilter.fromUser,
      toUser: debouncedFilter.toUser,
      sort: sortBy ? `${getSortPayload(sortBy)}:${direction}` : '',
      startAt: stringToDateFormat(effectiveDate.startDate),
      endAt: stringToDateFormat(effectiveDate.endDate),
      type: debouncedFilter.type.map(data => data.value),
      fileExtension: formatOption
    });
    if (result && !error) {
      let link = document.createElement("a");
      link.download = `export-activity-history-${stringToDateFormat(new Date(), LONG_DATE_TIME_FORMAT_BE)}.xls`;
      link.href = result.url;
      link.click();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || tCO('downloadActivityHistoryFailed'), { variant: 'error' });
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
    adminActivityData: adminActivityData?.result?.transactions || [],
    adminActivityStatus,
    fetchAdminActivity: () => {
      refetchAdminActivity();
    },
    handleDeleteFilter,
    formData,
  };
}

export default useActivityHistoryList;
