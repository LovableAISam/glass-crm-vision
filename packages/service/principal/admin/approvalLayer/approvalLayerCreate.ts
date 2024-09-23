import { ResponseData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

interface ApprovalLayerRole {
  role: string;
  roleId: string;
}

export interface ApprovalLayerCreateResponse extends ResponseData {}

export interface ApprovalLayerCreateRequest {
  menu: string;
  menuId: string;
  role: ApprovalLayerRole[];
}

function useApprovalLayerCreateFetcher(baseUrl: string, payload: ApprovalLayerCreateRequest) {
  return apiPost<ApprovalLayerCreateResponse>({
    baseUrl,
    path: `${apiApprovalLayer}`,
    payload,
  });
}

export default useApprovalLayerCreateFetcher;
