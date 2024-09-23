import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMenu } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MenuData extends ResponseData {
  name: string;
}

interface MenuListResponse extends ResultData<MenuData[]> {}

export interface MenuListRequest extends DefaultQueryPageRequest {}

function useMenuListFetcher(baseUrl: string, payload: MenuListRequest) {
  return apiGet<MenuListResponse>({
    baseUrl,
    path: `${apiMenu}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useMenuListFetcher;
