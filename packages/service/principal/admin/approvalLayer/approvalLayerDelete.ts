import { ResponseData } from '@woi/core/api';
import { apiApprovalLayer } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface ApprovalLayerDeleteResponse extends ResponseData {}

function useApprovalLayerDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<ApprovalLayerDeleteResponse>({
    baseUrl,
    path: `${apiApprovalLayer}/${id}`,
  });
}

export default useApprovalLayerDeleteFetcher;
