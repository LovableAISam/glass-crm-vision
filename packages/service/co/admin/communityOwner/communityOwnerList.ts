import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCommunityOwner } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type CommunityOwnerStatusType = 'ACTIVE' | 'ERROR' | 'INACTIVE' | 'PENDING';

export interface CommunityOwnerData extends ResponseData {
  name: string;
  code: string;
  provisioningStatus: CommunityOwnerStatusType;
  activeDate: string;
  inactiveDate: string;
  isActive: boolean;
  isEnabled: boolean;
}

interface CommunityOwnerListResponse extends ResultData<CommunityOwnerData[]> { }

export interface CommunityOwnerListRequest extends DefaultQueryPageRequest {
  'active-date'?: string;
  'inactive-date'?: string;
  search?: string;
  status?: CommunityOwnerStatusType[];
}

function useCommunityOwnerListFetcher(baseUrl: string, payload: CommunityOwnerListRequest) {
  return apiGet<CommunityOwnerListResponse>({
    baseUrl,
    path: `${apiCommunityOwner}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useCommunityOwnerListFetcher;
