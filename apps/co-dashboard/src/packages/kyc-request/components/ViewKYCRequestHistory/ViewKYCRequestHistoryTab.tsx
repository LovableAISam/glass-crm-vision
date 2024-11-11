import { CityData } from "@woi/service/co/admin/city/cityListByProvinceCode";
import { AllCountryData } from "@woi/service/co/admin/country/allCountryList";
import { CustomerProfile } from "@woi/service/co/admin/customerProfile/customerProfile";
import dynamic from 'next/dynamic';
import {
  KycPremiumMemberDetailForm,
  KycPremiumMemberDetailHistoryForm,
  MemberDetailForm,
} from '../../hooks/useKycRequstUpsert';

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
  listCountryResidence: AllCountryData[] | null;
  listCityResidence: CityData[] | null; 
  customerProfile: CustomerProfile | null;
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
