import { apiCommunityOwnerStatusType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type CommunityOwnerStatusType = 'ACTIVE' | 'ERROR' | 'INACTIVE' | 'PENDING';

type CommunityOwnerStatusListResponse = Record<CommunityOwnerStatusType, string>;

function useCommunityOwnerStatusListFetcher(baseUrl: string) {
  return apiGet<CommunityOwnerStatusListResponse>({
    baseUrl,
    path: `${apiCommunityOwnerStatusType}`,
  });
}

export default useCommunityOwnerStatusListFetcher;
