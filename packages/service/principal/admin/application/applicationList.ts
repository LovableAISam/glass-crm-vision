import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiApplication } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type ApplicationStatus = 'ACTIVE' | 'ERROR' | 'INACTIVE' | 'PENDING' | 'SUCCESS';

export interface ApplicationData extends ResponseData {
  name: string;
  status: ApplicationStatus;
  activeDate: string;
  communityOwnerId: string;
  enabled: true;
  inactiveDate: string;
  isActive: true,
}

interface ApplicationListResponse extends ResultData<ApplicationData[]> { }

export interface ApplicationListRequest extends DefaultQueryPageRequest {
  name?: string;
  status?: string[];
  'active-date'?: string;
  'inactive-date'?: string;
}

function useApplicationListFetcher(baseUrl: string, payload: ApplicationListRequest) {
  return apiGet<ApplicationListResponse>({
    baseUrl,
    path: `${apiApplication}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useApplicationListFetcher;
