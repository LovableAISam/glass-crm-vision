import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiBank } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';
import { BankStatus } from './bankList';

export interface BankCreateResponse extends ResponseData {}

export interface BankCreateRequest extends DefaultRequest {
  backgroundCard: string;
  color: string;
  fullName: string;
  logo: string;
  name: string;
  status: BankStatus | null;
}

function useBankCreateFetcher(baseUrl: string, payload: BankCreateRequest) {
  return apiPost<BankCreateResponse>({
    baseUrl,
    path: `${apiBank}`,
    payload,
  });
}

export default useBankCreateFetcher;
