import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiTransactionSummary } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';


export type UpgradeStatus = 'UPGRADE' | 'NOT_UPGRADE';

export type TransactionType =
  'ADD_MONEY_VIA_NG' |
  'ADD_MONEY_VIA_SAVING_ACCOUNT' |
  'SEND_MONEY' |
  'REQUEST_MONEY' |
  'ADD_MONEY_P2P' |
  'P2M_SCAN_TO_PAY' |
  'P2P_OUTGOING_SEND_TO_BANK' |
  'CASHOUT_TO_BPI' |
  'PAYBILLS_ECPAY';

export interface TransactionSummaryData extends ResponseData {
  amount: number,
  bacnetIsorc: string,
  balance: number,
  billerFee: string,
  bnisorc: string,
  dateTime: string,
  description: string,
  destinationBIC: string,
  destinationBank: string,
  destinationName: string,
  feeTransaction: number,
  merchantName: string,
  orderId: string,
  paymentMethod: string,
  receiverNumber: string,
  referralNumber: string,
  rmNumber: string,
  secondaryIdentifier: string,
  senderNumber: string,
  status: string,
  totalAmount: number,
  traceNumber: string,
  transactionHistoryId: string,
  transactionMethod: string,
  transactionNumber: string,
  transactionType: string;
}
interface ResultData<T> {
  data: T;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  transactions: TransactionSummaryData[];
}

interface TransactionSummaryResponse extends ResultData<TransactionSummaryData[]> { }

export interface TransactionSummaryRequest extends DefaultQueryPageRequest {
  endAt?: string;
  size?: number;
  startAt?: string;
  status?: string[];
  transactionType?: string[];
}

function useTransactionSummaryFetcher(baseUrl: string, payload: TransactionSummaryRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionSummaryResponse>({
    baseUrl,
    path: `${apiTransactionSummary}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useTransactionSummaryFetcher;
