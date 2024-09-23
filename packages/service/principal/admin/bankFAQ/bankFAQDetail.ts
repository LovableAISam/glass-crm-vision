import { apiBankFAQ } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { BankData } from '../bank/bankDetail';

export interface BankFAQData extends ResponseData {
  header: string;
  content: string;
  bank: BankData;
}

function useBankFAQDetailFetcher(baseUrl: string, id: string) {
  return apiGet<BankFAQData>({
    baseUrl,
    path: `${apiBankFAQ}/${id}`,
  });
}

export default useBankFAQDetailFetcher;
