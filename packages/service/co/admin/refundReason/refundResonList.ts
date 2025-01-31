import {
  DefaultQueryPageRequest,
  ResponseData,
  ResultData,
} from '@woi/core/api';
import { apiRefundReason } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface RefunReasonTypeData extends ResponseData {
  id: string;
  reason: string;
}

interface RefundReasonResponse extends ResultData<RefunReasonTypeData[]> {
  refundReasonList: RefunReasonTypeData[];
}

export interface RefunReasonListRequest extends DefaultQueryPageRequest {
  id?: string[];
  reason?: string[];
}

function useRefundReasonListFetcher(baseUrl: string) {
  return apiGet<RefundReasonResponse>({
    baseUrl,
    path: `${apiRefundReason}`,
  });
}

export default useRefundReasonListFetcher;
