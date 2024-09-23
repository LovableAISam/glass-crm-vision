import { constructUrlSearchParams } from '@woi/core/api';
import { apiBalanceCorrectionHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type StatusType = 'WAITING_APPROVAL' | 'REJECTED' | 'APPROVED';

export type ActionType = 'DEDUCT' | 'TOPUP';

export interface BalanceCorrectionHistoryData {
  accountName: string;
  rmNumber: string;
  status: StatusType | null;
  type: ActionType | null;
  accountPhoneNumber: string;
  amount: number;
  balanceAfter: number;
  balanceBefore: number;
  vaNumber: string;
  reason: string;
  role: string;
}

interface ResultData<T> {
  balanceCorrectionDto: T;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

interface BalanceCorrectionHistorytResponse extends ResultData<BalanceCorrectionHistoryData[]> { }

export interface BalanceCorrectionHistorytRequest {
  memberName?: string;
  sortBy?: string;
  status?: StatusType[];
  pageSize?: number;
  phoneNumber?: string;
  pageNumber?: number;
}

function useBalanceCorrectionHistorytFetcher(baseUrl: string, payload: BalanceCorrectionHistorytRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<BalanceCorrectionHistorytResponse>({
    baseUrl,
    path: `${apiBalanceCorrectionHistory}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useBalanceCorrectionHistorytFetcher;
