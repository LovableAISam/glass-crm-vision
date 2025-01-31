import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiKecamatan } from "@woi/common/meta/apiPaths/coApiPaths";
import apiGet from '@woi/common/api/apiGet';

export interface KecamatanData extends ResponseData {
  name: string;
}

interface KecamatanListResponse extends ResultData<KecamatanData[]> { }

export interface KecamatanListRequest extends DefaultQueryPageRequest {
  search?: string;
  'city-id': string;
}

function useKecamatanListFetcher(baseUrl: string, payload: KecamatanListRequest) {
  return apiGet<KecamatanListResponse>({
    baseUrl,
    path: `${apiKecamatan}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useKecamatanListFetcher;
