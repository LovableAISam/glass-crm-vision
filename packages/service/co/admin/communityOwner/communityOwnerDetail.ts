import { apiCommunityOwner } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CommunityOwnerAddress {
  address: string;
  cityId: string;
  countryId: string;
  postalCode: string;
  provinceId: string;
}

export interface CommunityOwnerBankAccount {
  bankId: string;
  bin: string;
  currencyId: string;
  fundType: string;
  name: string;
  number: string;
  vaLength: string;
}

export interface CommunityOwnerConfigurationSCP {
  id: string;
  merchantId: string;
  name: string;
  secretKey: string;
  userCredential: string;
}

export interface CommunityOwnerConfigurationSMTP {
  id: string;
  name: string;
  password: string;
  port: number;
  server: string;
  startTls: string;
  username: string;
}

export interface CommunityOwnerConfiguration {
  billerInquiryUrl: string;
  billerInquiryProductUrl: string;
  billerPaymentUrl: string;
  billerSourceId: string;
  billerSourcePassword: string;
  billerSourceUser: string;
  color: string;
  scp: CommunityOwnerConfigurationSCP;
  smtp: CommunityOwnerConfigurationSMTP;
}

export interface CommunityOwnerContact {
  number: string;
  type: string;
}

export interface CommunityOwnerUserOTP {
  channel: string;
  division: string;
  password: string;
  sender: string;
  username: string;
}

export interface CommunityOwnerUserPIC {
  id: string;
  isLocked: boolean;
  activeDate: string;
  inactiveDate: string;
  password: string;
  username: string;
  role: string;
  roleSecureId: string;
}

export interface CommunityOwnerDetailData {
  activeDate: string;
  addresses: CommunityOwnerAddress[];
  authenticationOtp: boolean;
  backgroundCard: string;
  bankAccounts: CommunityOwnerBankAccount[];
  bankLogo: string;
  cardable: boolean;
  code: string;
  configuration: CommunityOwnerConfiguration;
  contacts: CommunityOwnerContact[],
  email: string;
  isActive: boolean;
  inactiveDate: string;
  loyaltyMerchantCode: string;
  loyaltyMerchantId: string;
  loyaltySupport: boolean;
  name: string;
  registrationNeedOtp: boolean;
  siupNo: string;
  usersOTP: CommunityOwnerUserOTP[];
  usersPIC: CommunityOwnerUserPIC[];
}

function useCommunityOwnerDetailFetcher(baseUrl: string, id: string) {
  return apiGet<CommunityOwnerDetailData>({
    baseUrl,
    path: `${apiCommunityOwner}/${id}`,
  });
}

export default useCommunityOwnerDetailFetcher;
