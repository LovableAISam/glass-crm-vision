import { apiQrGenerate } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { constructUrlSearchParams } from "@woi/core/api";

export interface QrGenerateResponse {
  failure: boolean;
  status: {
    code: string;
    text: string;
    type: string;
  };
  qrString: string;
}

export interface QrGenerateRequest {
  merchantCode: string;
}

function useQrGenerateFetcher(baseUrl: string, payload: QrGenerateRequest) {
  return apiGet<QrGenerateResponse>({
    baseUrl,
    path: `${apiQrGenerate}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useQrGenerateFetcher;
