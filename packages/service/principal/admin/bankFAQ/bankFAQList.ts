import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiBankFAQ } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { BankData } from '../bank/bankDetail';

export interface BankFAQData extends ResponseData {
  header: string;
  content: string;
  bank: BankData;
}

interface BankFAQListResponse extends ResultData<BankFAQData[]> { }

export interface BankFAQListRequest extends DefaultQueryPageRequest {
  search_header?: string;
  search_content?: string;
  bank?: string[];
}

function useBankFAQListFetcher(baseUrl: string, payload: BankFAQListRequest) {
  return apiGet<BankFAQListResponse>({
    baseUrl,
    path: `${apiBankFAQ}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useBankFAQListFetcher;
