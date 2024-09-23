import { apiApprovalLayer } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

interface ApprovalLayerRole extends ResponseData {
  role: string;
  roleId: string;
}

export interface ApprovalLayerData extends ResponseData {
  menu: string;
  menuId: string;
  role: ApprovalLayerRole[];
}

function useApprovalLayerDetailFetcher(baseUrl: string, id: string) {
  return apiGet<ApprovalLayerData>({
    baseUrl,
    path: `${apiApprovalLayer}/${id}`,
  });
}

export default useApprovalLayerDetailFetcher;
