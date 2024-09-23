import { ResponseData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

interface ApprovalLayerRole {
  role: string;
  roleId: string;
}

export interface ApprovalLayerUpdateResponse extends ResponseData { }

export interface ApprovalLayerUpdateRequest {
  menu: string;
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
