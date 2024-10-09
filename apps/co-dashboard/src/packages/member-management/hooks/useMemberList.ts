// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useMemberListFetcher } from "@woi/service/co";
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useTranslation } from "react-i18next";
import { batch, reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { MemberData, MemberListRequest, MemberStatus, UpgradeStatus } from "@woi/service/co/idp/member/memberList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";
import { MemberStatusType } from "@woi/service/co/idp/member/memberStatusList";

type FilterForm = {
  phoneNumber: string;
  name: string;
  status: OptionMap<MemberStatusType>[];
  upgradeStatus: OptionMap<UpgradeStatus>[];
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  phoneNumber: '',
  name: '',
  status: [],
  upgradeStatus: [],
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

function useMemberList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof MemberData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const debouncedFilter = useDebounce(filterForm, 300);
  const { t: tMember } = useTranslation('member');

  const upgrageStatusOptions = <OptionMap<UpgradeStatus>[]>([
    {
      label: tMember('upgradeStatusNotUpgrade'),
      value: 'NOT_UPGRADE',
    },
    {
      label: tMember('upgradeStatusUpgrade'),
      value: 'UPGRADE',
    },
  ]);

  const statusOptions = <OptionMap<MemberStatus>[]>([
    {
      label: tMember('statusActive'),
      value: 'ACTIVE',
    },
    {
      label: tMember('statusLock'),
      value: 'LOCK',
    },
  ]);

  const memberPayload: MemberListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    name: debouncedFilter.name || '',
    phoneNumber: debouncedFilter.phoneNumber,
    status: debouncedFilter.status.map(data => data.value),
    upgradeStatus: debouncedFilter.upgradeStatus.map(data => data.value),
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: memberData,
    status: memberStatus,
    refetch: refetchMember
  } = useQuery(
    ['member-list', memberPayload],
    async () => useMemberListFetcher(baseUrl, memberPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.data && !response.error) {
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

  const handleSort = (columnId: keyof MemberData) => {
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

  const fetchMemberList = () => {
    refetchMember();
  };

  return {
    upgrageStatusOptions,
    statusOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberData: memberData?.result?.data || [],
    memberStatus,
    fetchMemberList,
    handleDeleteFilter
  };
}

export default useMemberList;
