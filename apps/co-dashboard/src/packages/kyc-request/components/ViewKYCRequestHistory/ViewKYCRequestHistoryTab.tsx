import React from 'react';
import dynamic from 'next/dynamic';
import {
  KycPremiumMemberDetailForm,
  KycPremiumMemberDetailHistoryForm,
  MemberDetailForm,
} from '../../hooks/useKycRequstUpsert';
import { ProvinceListResponse } from "@woi/service/co/admin/province/provinceList";
import { CityListResponse } from "@woi/service/co/admin/city/cityList";
import { CountryListResponse } from "@woi/service/co/admin/country/countryList";

const AccountInformation = dynamic(
  () => import('./content/AccountInformation'),
);
const PersonalDataHistory = dynamic(
  () => import('./content/PersonalDataHistory'),
);
const VerificationHistory = dynamic(
  () => import('./content/VerificationHistory'),
);

export type ViewKYCRequestTabProps = {
  activeTab: number | boolean;
  kycDetail: KycPremiumMemberDetailForm | null;
  kycDetailHistory: KycPremiumMemberDetailHistoryForm | null;
  memberDetail: MemberDetailForm | null;
  listCountryResidence: CountryListResponse | null;
  listCountryDomicile: CountryListResponse | null;
  listProvinceResidence: ProvinceListResponse | null;
  listProvinceDomicile: ProvinceListResponse | null;
  listCityResidence: CityListResponse | null;
  listCityDomicile: CityListResponse | null;
};

function ViewKYCRequestHistoryTab(props: ViewKYCRequestTabProps) {
  const { activeTab } = props;

  switch (activeTab) {
    case 0:
      // @ts-ignore
      return <AccountInformation {...props} />;
    case 1:
      // @ts-ignore
      return <PersonalDataHistory {...props} />;
    case 2:
      // @ts-ignore
      return <VerificationHistory {...props} />;
    default:
      return null;
  }
}

export default ViewKYCRequestHistoryTab;
