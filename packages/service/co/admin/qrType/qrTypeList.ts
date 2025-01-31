import { DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiQrType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface QrTypeListTypeData extends ResponseData {
  qrType: string[];
}

export interface QrTypeListResponse {
  qrType: string[];
}

export interface QrTypeListRequest extends DefaultQueryPageRequest {
  qrType?: string;
}

function useQrTypeListFetcher(baseUrl: string) {
  return apiGet<QrTypeListResponse>({
    baseUrl,
    path: `${apiQrType}`,
  });
}

export default useQrTypeListFetcher;
