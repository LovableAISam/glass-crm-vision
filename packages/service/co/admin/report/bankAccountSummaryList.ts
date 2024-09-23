import { DefaultQueryPageRequest, PaginationData, constructUrlSearchParams, } from '@woi/core/api';
import { apiBankAccountSummary } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface BankAccountSummaryData {
  amount: number;
  balance: number;
  category: string;
  dateTime: string;
  description: string;
  transactionId: string;
  transactionType: string;
}

export interface BankAccountSummaryRequest extends DefaultQueryPageRequest {
  endAt?: string;
  size?: number;
  startAt?: string;
}

export interface BankAccountSummaryResponse extends PaginationData {
  inquiryTime: string;
  name: string;
  period: string;
  transactions: BankAccountSummaryData[];
}

function useBankAccountSummaryFetcher(baseUrl: string, payload: BankAccountSummaryRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<BankAccountSummaryResponse>({
    baseUrl,
    path: `${apiBankAccountSummary}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useBankAccountSummaryFetcher;
