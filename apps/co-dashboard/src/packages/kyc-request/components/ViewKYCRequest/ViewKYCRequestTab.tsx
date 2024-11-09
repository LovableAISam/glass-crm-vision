import React from 'react';
import dynamic from 'next/dynamic';
import {
  KycPremiumMemberDetailForm,
  MemberDetailForm,
} from '../../hooks/useKycRequstUpsert';
import { KycPremiumMemberHistoryDetailData } from '@woi/service/co/kyc/premiumMember/premiumMemberHistoryDetail';
import { CountryListResponse } from '@woi/service/co/admin/country/countryList';
import { ProvinceListResponse } from '@woi/service/co/admin/province/provinceList';
import { CityListResponse } from '@woi/service/co/admin/city/cityList';

const AccountInformation = dynamic(
  () => import('./content/AccountInformation'),
);
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewKYCRequestTabProps = {
  activeTab: number | boolean;
  kycDetail: KycPremiumMemberDetailForm | null;
  kycDetailHistory: KycPremiumMemberHistoryDetailData | null;
  memberDetail: MemberDetailForm | null;
  listCountryResidence: CountryListResponse | null;
  listCountryDomicile: CountryListResponse | null;
  listProvinceResidence: ProvinceListResponse | null;
  listProvinceDomicile: ProvinceListResponse | null;
  listCityResidence: CityListResponse | null;
  listCityDomicile: CityListResponse | null;
};

function ViewKYCRequestTab(props: ViewKYCRequestTabProps) {
  const { activeTab } = props;

  switch (activeTab) {
    case 0:
      // @ts-ignore
      return <AccountInformation {...props} />;
    case 1:
      // @ts-ignore
      return <PersonalData {...props} />;
    default:
      return null;
  }
}

export default ViewKYCRequestTab;
