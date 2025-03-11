import {
  DefaultQueryPageRequest,
  ResponseData,
  ResultData,
} from '@woi/core/api';
import { apiKycType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface KycListTypeData extends ResponseData {
  cityId: string;
  cityName: string;
}

interface KycListResponse extends ResultData<KycListTypeData[]> {}

export interface KycListRequest extends DefaultQueryPageRequest {
  cityId?: string;
  cityName?: string;
}

function useKycListFetcher(baseUrl: string) {
  return apiGet<KycListResponse>({
    baseUrl,
    path: `${apiKycType}`,
  });
}

export default useKycListFetcher;
