import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiTransactionHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type TransactionHistoryStatus = 'SUCCESS';

type TransactionHistoryTransfer = {
  senderPhoneNumber: string;
  receiverAccountNo: string;
  transferAmount: number;
  chargeAmount: number;
  bank: {
    id: number;
    name: string;
  };
};

type TransactionHistoryDeposit = {
  phoneNumber: string;
  from: string;
  depositAmount: number;
  chargeAmount: number;
};

type TransactionHistoryWithdraw = {
  phoneNumber: string;
  withdrawAmount: number;
  chargeAmount: number;
};

type TransactionHistoryType = {
  id: number;
  code: string;
  name: string;
};

type TransactionHistoryCategory = {
  id: number;
  name: string;
  isRepeatable: boolean;
};

type TransactionHistoryMethod = {
  id: number;
  code: string;
  name: string;
};

export interface TransactionHistoryData extends ResponseData {
  // account: string;
  // date: string;
  // type: string;
  // amount: number;
  // transactionType: TransactionHistoryType | null;
  // transactionCategory: TransactionHistoryCategory | null;
  // transactionMethod: TransactionHistoryMethod | null;
  // status: TransactionHistoryStatus;
  // referenceId: string;
  // description: string;
  // successDate: string;
  // vaDest: string;
  // transfer: TransactionHistoryTransfer | null;
  // deposit: TransactionHistoryDeposit | null;
  // withdraw: TransactionHistoryWithdraw | null;
  // isDebit: boolean;
  // balance: number;
  // activityId: string;

  dateTime: string;
  type: string;
  method: string;
  transactionId: string;
  description: string;
  amount: number;
  balance: number;
  dbCr: string;

}

interface ResponseDataPagination<T> {
  transactions: T;
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

interface TransactionHistoryListResponse extends ResponseDataPagination<TransactionHistoryData[]> { }

export interface TransactionHistoryListRequest extends DefaultQueryPageRequest {
  status?: string;
  startDate?: string;
  endDate?: string;
  transactionType?: string[];
  phoneNumber?: string;
  receiverAccountNo?: string;
  referenceId?: string;
  description?: string;
  transactionAmount?: string;
  balance?: string;
}

function useTransactionHistoryListFetcher(baseUrl: string, payload: TransactionHistoryListRequest) {
  return apiGet<TransactionHistoryListResponse>({
    baseUrl,
    path: `${apiTransactionHistory}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useTransactionHistoryListFetcher;
