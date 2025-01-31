import apiPost from '@woi/common/api/apiPost';
import { apiQRDynamicUpdate } from '@woi/common/meta/apiPaths/coApiPaths';

export interface QRDynamicUpdateRequest {
  qrCode: string;
  qrStatus: string;
}

export interface QRDynamicUpdateResponse {
  status: string;
}

function useQRDynamicUpdateFetcher(baseUrl: string, payload: QRDynamicUpdateRequest) {
  return apiPost<QRDynamicUpdateResponse>({
    baseUrl,
    path: `${apiQRDynamicUpdate}`,
    payload: payload,
  });
}

export default useQRDynamicUpdateFetcher;
