import { ResponseData } from '@woi/core/api';
import { apiCommunityOwner } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';
import {
  CommunityOwnerAddress,
  CommunityOwnerBankAccount,
  CommunityOwnerConfiguration,
  CommunityOwnerContact,
  CommunityOwnerUserOTP
} from './communityOwnerDetail';

interface CommunityOwnerUserPIC {
  id: string;
  isLocked: boolean;
  activeDate: string;
  inactiveDate: string;
  password: string;
  username: string;
  role: string;
}

export interface CommunityOwnerCreateResponse extends ResponseData { }

export interface CommunityOwnerCreateRequest {
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

function useCommunityOwnerCreateFetcher(baseUrl: string, payload: CommunityOwnerCreateRequest) {
  return apiPost<CommunityOwnerCreateResponse>({
    baseUrl,
    path: `${apiCommunityOwner}`,
    payload,
  });
}

export default useCommunityOwnerCreateFetcher;
