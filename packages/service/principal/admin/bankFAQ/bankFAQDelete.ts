import { ResponseData } from '@woi/core/api';
import { apiBankFAQ } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface BankFAQDeleteResponse extends ResponseData {}

function useBankFAQDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<BankFAQDeleteResponse>({
    baseUrl,
    path: `${apiBankFAQ}/${id}`,
  });
}

export default useBankFAQDeleteFetcher;
