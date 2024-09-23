import { ResponseData } from '@woi/core/api';
import { apiApprovalLayerMenu } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface ApprovalLayerMenuDeleteResponse extends ResponseData { }

function useApprovalLayerMenuDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<ApprovalLayerMenuDeleteResponse>({
    baseUrl,
    path: `${apiApprovalLayerMenu}/${id}`,
  });
}

export default useApprovalLayerMenuDeleteFetcher;
