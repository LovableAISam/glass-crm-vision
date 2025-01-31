import apiGet from '@woi/common/api/apiGet';
import { apiQRDynamicStatus } from '@woi/common/meta/apiPaths/coApiPaths';
import { constructUrlSearchParams } from '@woi/core/api';

export interface CreateQrTypeData {
  amount: number;
  merchanCode: string;
}

export interface QRDynamicStatusResponse {
  amount: number;
  cpan: string;
  date: string;
  issuerName: string;
  mpan: string;
  status: string;
  rrn: string;
}

export interface QRDynamicStatusRequest {
  amount: number;
  merchantCode: string;
  qrString: string;
}

function useQRDynamicStatusFetcher(baseUrl: string, payload: QRDynamicStatusRequest) {
  return apiGet<QRDynamicStatusResponse>({
    baseUrl,
    path: `${apiQRDynamicStatus}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useQRDynamicStatusFetcher;
