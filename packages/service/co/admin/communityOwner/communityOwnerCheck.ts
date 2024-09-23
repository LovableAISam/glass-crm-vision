import { apiCommunityOwnerDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { CommunityOwnerDetailData } from './communityOwnerDetail';
import { constructUrlSearchParams } from '@woi/core/api';

export interface CommunityOwnerCheckRequest {
  code?: string;
  key?: string;
}

function useCommunityOwnerCheckFetcher(baseUrl: string, payload: CommunityOwnerCheckRequest) {
  return apiGet<CommunityOwnerDetailData>({
    baseUrl,
    path: `${apiCommunityOwnerDetail}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useCommunityOwnerCheckFetcher;
