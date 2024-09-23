import { ResponseData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

interface ApprovalLayerRole {
  role: string;
  roleId: string;
  level: number;
}

export interface ApprovalLayerUpdateResponse extends ResponseData { }

export interface ApprovalLayerUpdateRequest {
  menuId: string;
  role: ApprovalLayerRole[];
}

function useApprovalLayerUpdateFetcher(baseUrl: string, id: string, payload: ApprovalLayerUpdateRequest) {
  return apiPut<ApprovalLayerUpdateResponse>({
    baseUrl,
    path: `${apiApprovalLayer}/${id}`,
    payload,
  });
}

export default useApprovalLayerUpdateFetcher;
