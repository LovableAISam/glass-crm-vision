// Cores
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useTransactionTypeOptionListFetcher, useAccountRuleValueListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { AccountRuleValueData, AccountRuleValueListRequest } from "@woi/service/principal/admin/accountRuleValue/accountRuleValueList";
import { OptionMap } from "@woi/option";
import { DatePeriod } from "@woi/core/utils/date/types";

type FilterForm = {
  accountRulesName: string;
  transactionType: OptionMap<string>[];
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  accountRulesName: '',
  transactionType: [],
  activeDate: {
    startDate: null,
    endDate: null,
  }
};

function useAccountRuleValueList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof AccountRuleValueData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const { data: transactionTypeData } = useQuery(
    ['transaction-type-list'],
    async () => await useTransactionTypeOptionListFetcher(baseUrl, {
      target: 'ONLY_CREATED_IN_ACCOUNT_RULE_VALUES',
    }),
    { refetchOnWindowFocus: false }
  );

  const transactionTypeOptions = useMemo(() => {
    if (!transactionTypeData) return [];
    return Object.entries(transactionTypeData.result || {}).map(([key, value]) => ({
      label: value,
      value: key
    }));
  }, [transactionTypeData]);

  const accountRuleValueListPayload: AccountRuleValueListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    accountRulesName: debouncedFilter.accountRulesName,
    transactionTypeName: debouncedFilter.transactionType.map(data => data.value),
    'active-date': stringToDateFormat(debouncedFilter.activeDate.startDate),
    'inactive-date': stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: accountRuleValueData,
    status: accountRuleValueStatus,
    refetch: refetchAccountRuleValue
  } = useQuery(
    ['account-rule-value-list', accountRuleValueListPayload],
    async () => await useAccountRuleValueListFetcher(baseUrl, accountRuleValueListPayload),
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

  const handleSort = (columnId: keyof AccountRuleValueData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    transactionTypeOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    accountRuleValueData: accountRuleValueData?.result?.data || [],
    accountRuleValueStatus,
    fetchAccountRuleValueList: () => {
      refetchAccountRuleValue();
    },
  };
}

export default useAccountRuleValueList;
