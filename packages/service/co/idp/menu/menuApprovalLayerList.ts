import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMenuApprovalLayer } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MenuApprovalLayerData extends ResponseData {
  name: string;
}

interface MenuListResponse extends ResultData<MenuApprovalLayerData[]> { }

export interface MenuListRequest extends DefaultQueryPageRequest { }

function useMenuApprovalLayerListFetcher(baseUrl: string, payload: MenuListRequest) {
  return apiGet<MenuListResponse>({
    baseUrl,
    path: `${apiMenuApprovalLayer}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMenuApprovalLayerListFetcher;
