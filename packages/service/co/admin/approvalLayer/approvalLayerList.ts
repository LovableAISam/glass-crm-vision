import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface ApprovalLayerRole extends ResponseData {
  role: string;
  roleId: string;
  level: number;
}

export interface ApprovalLayerData extends ResponseData {
  menuId: string;
  menu: string;
  total: number;
  role: ApprovalLayerRole[] | null;
}

interface ApprovalLayerListResponse extends ResultData<ApprovalLayerData[]> { }

export interface ApprovalLayerListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useApprovalLayerListFetcher(baseUrl: string, payload: ApprovalLayerListRequest) {
  return apiGet<ApprovalLayerListResponse>({
    baseUrl,
    path: `${apiApprovalLayer}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useApprovalLayerListFetcher;
