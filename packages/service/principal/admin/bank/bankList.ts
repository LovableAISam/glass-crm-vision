import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiBank } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type BankStatus = "ACTIVE" | "DISABLED" | "INACTIVE" | "VERIFY";

export interface BankData extends ResponseData {
  name: string;
  fullName: string;
  status: BankStatus;
}

interface BankListResponse extends ResultData<BankData[]> {}

export interface BankListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useBankListFetcher(baseUrl: string, payload: BankListRequest) {
  return apiGet<BankListResponse>({
    baseUrl,
    path: `${apiBank}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useBankListFetcher;
