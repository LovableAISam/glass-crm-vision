import { constructApiPath } from '@woi/core/api';
import { apiCommunityOwnerActivation } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type CommunityOwnerStatusType = 'ERROR' | 'RUNNING' | 'SUCCESS' | 'NEXT';

export interface CommunityOwnerActivationData {
  name: string;
  status: CommunityOwnerStatusType;
}

export interface CommunityOwnerActivationDataStep {
  steps: CommunityOwnerActivationData[];
}

interface CommunityOwnerActivationListResponse extends CommunityOwnerActivationDataStep {}

function useCommunityOwnerActivationListFetcher(baseUrl: string, id: string) {
  return apiGet<CommunityOwnerActivationListResponse>({
    baseUrl,
    path: constructApiPath(`${apiCommunityOwnerActivation}`, { id }),
  });
}

export default useCommunityOwnerActivationListFetcher;
