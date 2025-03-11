import {
  DefaultQueryPageRequest,
  ResponseData,
  ResultData,
} from '@woi/core/api';
import { apiQrLocationType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface QrLocationListTypeData extends ResponseData {
  id: string;
  name: string;
}

interface QrLocationListResponse extends ResultData<QrLocationListTypeData[]> {
  merchantLocationList: string;
}

export interface QrLocationListRequest extends DefaultQueryPageRequest {
  id?: string;
  name?: string;
}

function useQrLocationListFetcher(baseUrl: string) {
  return apiGet<QrLocationListResponse>({
    baseUrl,
    path: `${apiQrLocationType}`,
  });
}

export default useQrLocationListFetcher;
