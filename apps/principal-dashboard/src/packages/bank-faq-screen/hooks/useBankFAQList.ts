// Cores
import { useMemo, useState } from "react";

// Hooks & Utils
import { useBankListFetcher, useBankFAQListFetcher } from "@woi/service/principal";
import useDebounce from "@woi/common/hooks/useDebounce";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { reverseDirection } from "@woi/core";

// Types & Consts
import { PaginationData } from "@woi/core/api";
import { BankFAQData, BankFAQListRequest } from "@woi/service/principal/admin/bankFAQ/bankFAQList";
import { OptionMap } from "@woi/option";
import { useQuery } from "@tanstack/react-query";

type FilterForm = {
  header: string;
  content: string;
  bank: OptionMap<string>[];
};

function useBankFAQList() {
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState<keyof BankFAQData>();
  const [direction, setDirection] = useState<"desc" | "asc">("desc");
  const [filterForm, setFilterForm] = useState<FilterForm>({
    header: '',
    content: '',
    bank: [],
  });
  const debouncedFilter = useDebounce(filterForm, 300);
  const { baseUrl } = useBaseUrl();

  const { data: bankListData } = useQuery(
    ['bank-list'],
    async () => await useBankListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    }),
    { refetchOnWindowFocus: false }
  );

  const bankOptions: OptionMap<string>[] = useMemo(() => {
    if (!bankListData) return [];
    return (bankListData.result?.data || []).map(data => ({
      label: data.name,
      value: data.id
    }));
  }, [bankListData]);

  const bankFAQListPayload: BankFAQListRequest = {
    page: pagination.currentPage,
    limit: pagination.limit,
    sort: sortBy ? `${sortBy}:${direction}` : '',
    search_content: debouncedFilter.content,
    search_header: debouncedFilter.header,
    bank: debouncedFilter.bank.map(data => data.value),
  };

  const {
    data: bankFAQData,
    status: bankFAQStatus,
    refetch: refetchBankFAQ
  } = useQuery(
    ['bank-faq-list', bankFAQListPayload],
    async () => await useBankFAQListFetcher(baseUrl, bankFAQListPayload),
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

  const handleSort = (columnId: keyof BankFAQData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  return {
    bankOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    bankFAQData: bankFAQData?.result?.data || [],
    bankFAQStatus,
    fetchBankFAQList: () => {
      refetchBankFAQ();
    },
  };
}

export default useBankFAQList;