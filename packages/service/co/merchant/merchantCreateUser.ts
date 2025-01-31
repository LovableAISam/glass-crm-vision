import { DefaultRequest } from '@woi/core/api';
import { apiMerchantUserCreate } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface MerchantCreateUserResponse {
  status: {
    code: string;
    text: string;
    type: string;
  },
  failure: boolean;
}

export interface MerchantCreateUserRequest extends DefaultRequest {
  activeDate: string;
  description: string;
  inactiveDate: string;
  name: string;
  password: string;
  roleId: string;
  username: string;
  coId: string;
  isComingFromKafkaMessage: boolean,
  merchantCode: string;
  type: string;
}

function useMerchantCreateUser(baseUrl: string, payload: MerchantCreateUserRequest) {
  return apiPost<MerchantCreateUserResponse>({
    baseUrl,
    path: `${apiMerchantUserCreate}`,
    payload,
  });
}

export default useMerchantCreateUser;
