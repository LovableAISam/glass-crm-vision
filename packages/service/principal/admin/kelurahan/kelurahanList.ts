import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiKelurahan } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface KelurahanData extends ResponseData {
  name: string;
}

interface KelurahanListResponse extends ResultData<KelurahanData[]> { }

export interface KelurahanListRequest extends DefaultQueryPageRequest {
  search?: string;
  'kecamatan-id': string;
}

function useKelurahanListFetcher(baseUrl: string, payload: KelurahanListRequest) {
  return apiGet<KelurahanListResponse>({
    baseUrl,
    path: `${apiKelurahan}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useKelurahanListFetcher;
