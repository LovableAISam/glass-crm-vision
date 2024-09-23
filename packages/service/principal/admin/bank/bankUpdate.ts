import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiBank } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';
import { BankStatus } from './bankList';

export interface BankUpdateResponse extends ResponseData {}

export interface BankUpdateRequest extends DefaultRequest {
  backgroundCard: string;
  color: string;
  fullName: string;
  logo: string;
  name: string;
  status: BankStatus | null;
}

function useBankUpdateFetcher(baseUrl: string, id: string, payload: BankUpdateRequest) {
  return apiPut<BankUpdateResponse>({
    baseUrl,
    path: `${apiBank}/${id}`,
    payload,
  });
}

export default useBankUpdateFetcher;
