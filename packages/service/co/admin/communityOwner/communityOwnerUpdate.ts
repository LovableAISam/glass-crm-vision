import { ResponseData } from '@woi/core/api';
import { apiCommunityOwner } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';
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

export interface CommunityOwnerUpdateResponse extends ResponseData { }

export interface CommunityOwnerUpdateRequest {
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

function useCommunityOwnerUpdateFetcher(baseUrl: string, id: string, payload: CommunityOwnerUpdateRequest) {
  return apiPut<CommunityOwnerUpdateResponse>({
    baseUrl,
    path: `${apiCommunityOwner}/${id}`,
    payload,
  });
}

export default useCommunityOwnerUpdateFetcher;
