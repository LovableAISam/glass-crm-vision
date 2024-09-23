import { constructUrlSearchParams } from '@woi/core/api';
import { apiMemberActivation } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export type MemberActivationRequest = {
  activationStatus: 'ACTIVE' | 'LOCK';
};

function useMemberActivationFetcher(baseUrl: string, id: string, payload: MemberActivationRequest) {
  return apiPut<boolean>({
    baseUrl,
    path: `${apiMemberActivation}/${id}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMemberActivationFetcher;
