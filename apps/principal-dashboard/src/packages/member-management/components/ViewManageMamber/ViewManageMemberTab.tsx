import React from 'react';
import dynamic from 'next/dynamic';
import {
  KycPremiumMemberDetailHistoryForm,
  MemberDetailForm,
} from '../../hooks/useMemberUpsert';
import { CountryListResponse } from '@woi/service/co/admin/country/countryList';
import { ProvinceListResponse } from '@woi/service/co/admin/province/provinceList';
import { CityListResponse } from '@woi/service/co/admin/city/cityList';
import { MemberData } from '@woi/service/co/idp/member/memberList';

const AccountInformation = dynamic(
  () => import('./content/AccountInformation'),
);
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewManageMemberTabProps = {
  activeTab: number;
  memberDetail: MemberDetailForm | null;
  memberKYCDetail: KycPremiumMemberDetailHistoryForm | null;
  listCountryResidence: CountryListResponse | null;
  listCountryDomicile: CountryListResponse | null;
  listProvinceResidence: ProvinceListResponse | null;
  listProvinceDomicile: ProvinceListResponse | null;
  listCityResidence: CityListResponse | null;
  listCityDomicile: CityListResponse | null;
  selectedData: MemberData;
  showModalUpdate: () => void;
};

function ViewManageMemberTab(props: ViewManageMemberTabProps) {
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

export default ViewManageMemberTab;
