import {
  constructUrlSearchParams,
  DefaultQueryPageRequest,
  ResponseData,
} from '@woi/core/api';
import { apiQRISReport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type TransactionType =
  | 'ADD_MONEY_VIA_NG'
  | 'ADD_MONEY_VIA_SAVING_ACCOUNT'
  | 'SEND_MONEY'
  | 'REQUEST_MONEY'
  | 'ADD_MONEY_P2P'
  | 'P2M_SCAN_TO_PAY'
  | 'P2P_OUTGOING_SEND_TO_BANK'
  | 'CASHOUT_TO_BPI'
  | 'PAYBILLS_ECPAY';

export interface QRISReportRequest extends DefaultQueryPageRequest {
  startAt?: string;
  endAt?: string;
  size?: number;
  transactionType?: string[];
  qrType?: string[];
  qrisType?: string[];
  qrisLocation?: string[];
  kycLocation?: string[];
  merchantCategoryCode?: string[];
  merchantCriteria?: string[];
  merchantName?: string;
  status?: string;
}

export interface QRISReport extends ResponseData {
  date: string;
  qrType: string;
  issuer: string;
  from: string;
  to: string;
  merchantName: string;
  merchantLocation: string;
  amount: number;
  tips: number;
  status: string;
  transactionNumber: string;
  qrisLocation: string;
  kycLocation: string;
  merchantCategory: string;
  merchantCriteria: string;
  vaSource: string;
  vaDestination: string;
  referralNumber: string;
  paymentMethod: string;
  rrn: string;
  acquirerName: string;
  merchantPan: string;
  terminalId: string;
  customerPan: string;
  transactionType: string;
  debitCredit: string;
  transactionAmount: string;
  feeCommission: string;
  transactionNo: string;
  id: string;
}

export interface ResponseDataQRISReport {
  id?: string;
  data: QRISReportRequest[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

function useQRISSettlementFetcher(baseUrl: string, payload: QRISReportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<ResponseDataQRISReport>({
    baseUrl,
    path: `${apiQRISReport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useQRISSettlementFetcher;
