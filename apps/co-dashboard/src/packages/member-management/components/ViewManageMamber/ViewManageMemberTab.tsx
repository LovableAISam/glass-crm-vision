import React from 'react';
import dynamic from 'next/dynamic';
import { KycPremiumMemberDetailHistoryForm, MemberDetailForm } from '../../hooks/useMemberUpsert';
import { AllCountryData } from "@woi/service/co/admin/country/allCountryList";
import { CityData } from "@woi/service/co/admin/city/cityListByProvinceCode";
import { CustomerProfile } from "@woi/service/co/admin/customerProfile/customerProfile";

const AccountInformation = dynamic(
  () => import('./content/AccountInformation'),
);
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewManageMemberTabProps = {
  activeTab: number;
  memberDetail: MemberDetailForm | null;
  memberKYCDetail: KycPremiumMemberDetailHistoryForm | null;
  listCountryResidence: AllCountryData[] | null;
  listCityResidence: CityData[] | null;
  customerProfile: CustomerProfile | null;
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
