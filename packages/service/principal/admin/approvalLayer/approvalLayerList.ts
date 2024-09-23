import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface ApprovalLayerRole {
  role: string;
  roleId: string;
}

export interface ApprovalLayerData extends ResponseData {
  menuId: string;
  menu: string;
  role: ApprovalLayerRole[];
}

interface ApprovalLayerListResponse extends ResultData<ApprovalLayerData[]> { }

export interface ApprovalLayerListRequest extends DefaultQueryPageRequest {
  menu?: string;
}

function useApprovalLayerListFetcher(baseUrl: string, payload: ApprovalLayerListRequest) {
  return apiGet<ApprovalLayerListResponse>({
    baseUrl,
    path: `${apiApprovalLayer}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useApprovalLayerListFetcher;
