// Core
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Hooks & Utils
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import {
  useMerchantProfileFetcher,
  useQrGeneratorFetcher,
} from '@woi/service/co';
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { PaginationData } from '@woi/core/api';
import { DatePeriod } from '@woi/core/utils/date/types';
import { OptionMap } from '@woi/option';
import {
  MemberData,
  MemberStatus,
  UpgradeStatus,
} from '@woi/service/co/idp/member/memberList';
import { MemberStatusType } from '@woi/service/co/idp/member/memberStatusList';

type FilterForm = {
  phoneNumber: string;
  rmNumber: string;
  name: string;
  status: OptionMap<MemberStatusType>[];
  upgradeStatus: OptionMap<UpgradeStatus>[];
  activeDate: DatePeriod;
};

const initialFilterForm: FilterForm = {
  phoneNumber: '',
  rmNumber: '',
  name: '',
  status: [],
  upgradeStatus: [],
  activeDate: {
    startDate: null,
    endDate: null,
  },
};

function useAccountInformation() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,
    limit: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy] = useState<keyof MemberData>();
  const [direction] = useState<'desc' | 'asc'>('desc');
  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilterForm);
  const { baseUrl } = useBaseUrl();
  const { t: tMember } = useTranslation('member');
  const { merchantCode } = useCommunityOwner();

  const upgrageStatusOptions = <OptionMap<UpgradeStatus>[]>[
    {
      label: tMember('upgradeStatusNotUpgrade'),
      value: 'NOT_UPGRADE',
    },
    {
      label: tMember('upgradeStatusUpgrade'),
      value: 'UPGRADE',
    },
  ];

  const statusOptions = <OptionMap<MemberStatus>[]>[
    {
      label: tMember('statusActive'),
      value: 'ACTIVE',
    },
    {
      label: tMember('statusLock'),
      value: 'LOCK',
    },
  ];

  const { data: merchantProfileData, status: merchantProfileStatus } = useQuery(
    ['merchant-profile'],
    async () => useMerchantProfileFetcher(baseUrl, merchantCode),
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: qrGeneratorData, status: qrGeneratorStatus } = useQuery(
    ['qr-generate'],
    async () => {
      return useQrGeneratorFetcher(baseUrl, {
        merchantCode: merchantCode,
      });
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const generateQrCode = (_merchantProfileData: any) => {
    queryClient.invalidateQueries(['qr-generate']);
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
    merchantProfileData: merchantProfileData?.result,
    merchantProfileStatus,
    qrContent: qrGeneratorData?.result?.qrString || '',
    qrGeneratorStatus,
    generateQrCode,
  };
}

export default useAccountInformation;
