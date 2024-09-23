import { apiBalanceCorrectionApproval } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from "@woi/common/api/apiPost";
import { ResponseData } from "@woi/core/api";
import { CorrectionType } from "./createBalanceCorrection";

export type ActionType = 'APPROVED' | 'REJECTED';

export interface BalanceCorretionApprovalResponse extends ResponseData { }

export interface BalanceCorretionApprovalRequest {
  action: ActionType;
  balanceCorrectionId: string;
  reason: string;
  password?: string;
  amountToCorrect?: number;
  type?: CorrectionType | null;
}

function useBalanceCorretionApprovalFetcher(baseUrl: string, payload: BalanceCorretionApprovalRequest) {
  return apiPost<BalanceCorretionApprovalResponse>({
    baseUrl,
    path: `${apiBalanceCorrectionApproval}`,
    payload,
  });
}

export default useBalanceCorretionApprovalFetcher;
