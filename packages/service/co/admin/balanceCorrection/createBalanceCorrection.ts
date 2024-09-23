import { apiCreateBalanceCorrection } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from "@woi/common/api/apiPost";

export type CorrectionType = 'DEDUCT' | 'TOPUP';

interface DefaultResponse<T> {
  descriptions: Array<string | null>;
  details: Array<string>;
  errorCode: number;
  message: string;
  status: number;
  timestamp: string;
  data: T;
}

export interface MemberLockData {
  amount: number;
  balanceAfter: number;
  balanceBefore: number;
  createdBy: string;
  createdDate: string;
  id: number;
  isActive: true,
  lastResponseUser: string;
  memberId: number;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  phoneNumber: string;
  referenceNumber: string;
  secureId: string;
  status: string;
  type: string;
  vaNumber: string;
  waitingApprovalLayer: number;
}

interface CreateBalanceCorretionResponse extends DefaultResponse<MemberLockData[]> { }

export interface CreateBalanceCorretionRequest {
  type?: CorrectionType | null;
  amountToCorrect?: number;
  phoneNumber?: string;
  password?: string;
}

function useCreateBalanceCorretionFetcher(baseUrl: string, payload: CreateBalanceCorretionRequest) {
  return apiPost<CreateBalanceCorretionResponse>({
    baseUrl,
    path: `${apiCreateBalanceCorrection}`,
    payload,
  });
}

export default useCreateBalanceCorretionFetcher;
