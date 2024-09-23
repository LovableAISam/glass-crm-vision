import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiBankFAQ } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface BankFAQUpdateResponse extends ResponseData { }

export interface BankFAQUpdateRequest extends DefaultRequest {
  header: string;
  content: string;
  bank: string;
}

function useBankFAQUpdateFetcher(baseUrl: string, id: string, payload: BankFAQUpdateRequest) {
  return apiPut<BankFAQUpdateResponse>({
    baseUrl,
    path: `${apiBankFAQ}/${id}`,
    payload,
  });
}

export default useBankFAQUpdateFetcher;
