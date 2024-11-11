import { CityData } from "@woi/service/co/admin/city/cityListByProvinceCode";
import { AllCountryData } from "@woi/service/co/admin/country/allCountryList";
import { CustomerProfile } from "@woi/service/co/admin/customerProfile/customerProfile";
import { KycPremiumMemberHistoryDetailData } from '@woi/service/co/kyc/premiumMember/premiumMemberHistoryDetail';
import dynamic from 'next/dynamic';
import {
  KycPremiumMemberDetailForm,
  MemberDetailForm,
} from '../../hooks/useKycRequstUpsert';

const AccountInformation = dynamic(
  () => import('./content/AccountInformation'),
);
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewKYCRequestTabProps = {
  activeTab: number | boolean;
  kycDetail: KycPremiumMemberDetailForm | null;
  kycDetailHistory: KycPremiumMemberHistoryDetailData | null;
  memberDetail: MemberDetailForm | null;
  listCountryResidence: AllCountryData[] | null;
  listCityResidence: CityData[] | null;
  customerProfile: CustomerProfile | null;
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
