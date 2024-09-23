// Cores
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useDebounce from "@woi/common/hooks/useDebounce";
import { calculateDateRangeDays, stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { userChannelReliabilityFetcher } from "@woi/service/co";

// Types & Consts
import { DatePeriod } from "@woi/core/utils/date/types";
import { ChannelReliabilityRequest } from "@woi/service/co/admin/channelReliability/channelReliabilityList";
import { batch } from "@woi/core";
import { useSnackbar } from "notistack";

type FilterForm = {
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  activeDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
};

function useDailyChannelReliabilityList() {
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const debouncedFilter = useDebounce(filterForm, 300);

  const handleChangeDate = (value: any): void => {
    batch(() => {
      const { startDate, endDate } = value;
      if (calculateDateRangeDays(startDate, endDate) > 730) {
        enqueueSnackbar(
          'Effective date to cannot be greater than 730 days from effective date from.',
          {
            variant: 'error',
          },
        );
      } else {
        setFilterForm((oldForm) => ({
          ...oldForm,
          activeDate: value,
        }));
      }
    });
  };

  const dailyChannelReliabilityPayload: ChannelReliabilityRequest = {
    from: stringToDateFormat(debouncedFilter.activeDate.startDate),
    to: stringToDateFormat(debouncedFilter.activeDate.endDate),
  };

  const {
    data: dailyChannelReliabilityData,
    status: dailyChannelReliabilityStatus,
    refetch: refetchUserFundBalance
  } = useQuery(
    ['user-fund-balance-list', dailyChannelReliabilityPayload],
    async () => userChannelReliabilityFetcher(baseUrl, dailyChannelReliabilityPayload),
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    filterForm,
    setFilterForm,
    dailyChannelReliabilityData: dailyChannelReliabilityData?.result || [],
    dailyChannelReliabilityStatus,
    refetchUserFundBalance,
    handleChangeDate
  };
}

export default useDailyChannelReliabilityList;
