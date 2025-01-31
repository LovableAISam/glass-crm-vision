import { ResultData } from '@woi/core/api';
import { apiCreateQR } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CreateQrTypeData {
  amount: number;
  merchanCode: string;
}

interface CreateQrTypeListResponse extends ResultData<CreateQrTypeData[]> {
  validityPeriod: string;
  qrString: string;
}

function useCreateQrTypeListFetcher(baseUrl: string, amount: number, merchantCode: string) {
  return apiGet<CreateQrTypeListResponse>({
    baseUrl,
    path: `${apiCreateQR}?amount=${amount}&merchantCode=${merchantCode}`, // Add query parameters
  });
}

export default useCreateQrTypeListFetcher;
