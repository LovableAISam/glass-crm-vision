import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiFDSHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface FDSHistory extends ResponseData {
  name: string;
  sender: string;
  refId: string;
  receiver: string;
  accountNo: string;
  transactionType: string;
  amount: number;
  paymentMethod: string;
}

interface FDSHistoryResponse extends ResultData<FDSHistory[]> { }

export interface FDSHistoryRequest extends DefaultQueryPageRequest {
  startAt?: string;
  endAt?: string;
  status?: string;
  size?: number;
  phoneNumber?: string;
  transactionType?: string[];
}

function useFDSHistoryListFetcher(baseUrl: string, payload: FDSHistoryRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<FDSHistoryResponse>({
    baseUrl,
    path: `${apiFDSHistory}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useFDSHistoryListFetcher;
