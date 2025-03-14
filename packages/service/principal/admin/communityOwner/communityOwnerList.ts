import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCommunityOwner } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type CommunityOwnerStatusType = 'ACTIVE' | 'ERROR' | 'INACTIVE' | 'PENDING';

export interface CommunityOwnerData extends ResponseData {
  name: string;
  provisioningStatus: CommunityOwnerStatusType;
  activeDate: string;
  inactiveDate: string;
  isActive: boolean;
  enabled: boolean;
}

interface CommunityOwnerListResponse extends ResultData<CommunityOwnerData[]> { }

export interface CommunityOwnerListRequest extends DefaultQueryPageRequest {
  'active-date'?: string;
  'inactive-date'?: string;
  name?: string;
  status?: CommunityOwnerStatusType[];
  hideAppCustom?: boolean;
}

function useCommunityOwnerListFetcher(baseUrl: string, payload: CommunityOwnerListRequest) {
  return apiGet<CommunityOwnerListResponse>({
    baseUrl,
    path: `${apiCommunityOwner}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useCommunityOwnerListFetcher;
