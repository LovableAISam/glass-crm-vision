import { constructUrlSearchParams, DefaultQueryPageRequest, DefaultResponseTransactionsPagination, ResponseData } from '@woi/core/api';
import { apiTransactionHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type TransactionHistoryStatus = 'SUCCESS';

export interface MemberTransactionHistoryData extends ResponseData {
  amount: number;
  balance: number;
  dateTime: string;
  dbCr: string;
  description: string;
  method: string;
  transactionId: string;
  type: string;
}

interface TransactionHistoryListResponse extends DefaultResponseTransactionsPagination<MemberTransactionHistoryData[]> { }

export interface MemberTransactionHistoryListRequest extends DefaultQueryPageRequest {
  endAt?: string;
  phoneNumber?: string;
  size?: number;
  startAt?: string;
}

function useMemberTransactionHistoryListFetcher(baseUrl: string, payload: MemberTransactionHistoryListRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionHistoryListResponse>({
    baseUrl,
    path: `${apiTransactionHistory}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMemberTransactionHistoryListFetcher;
