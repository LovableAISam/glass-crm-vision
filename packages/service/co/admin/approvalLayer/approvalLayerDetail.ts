import { apiApprovalLayer } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

interface ApprovalLayerRole extends ResponseData {
  role: string;
  roleId: string;
  level: number;
}

export interface ApprovalLayerDetailData extends ResponseData {
  menu: string;
  menuId: string;
  total: number;
  role: ApprovalLayerRole[];
}

function useApprovalLayerDetailFetcher(baseUrl: string, id: string) {
  return apiGet<ApprovalLayerDetailData>({
    baseUrl,
    path: `${apiApprovalLayer}/${id}`,
  });
}

export default useApprovalLayerDetailFetcher;
