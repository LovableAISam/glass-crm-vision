import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiBankFAQ } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface BankFAQCreateResponse extends ResponseData { }

export interface BankFAQCreateRequest extends DefaultRequest {
  header: string;
  content: string;
  bank: string;
}

function useBankFAQCreateFetcher(baseUrl: string, payload: BankFAQCreateRequest) {
  return apiPost<BankFAQCreateResponse>({
    baseUrl,
    path: `${apiBankFAQ}`,
    payload,
  });
}

export default useBankFAQCreateFetcher;
