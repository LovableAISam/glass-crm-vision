import { apiTransactionSummary } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface DataTransactionSummary {
    dateTime: string,
    type: string,
    vaSource: string,
    vaDestination: string,
    amount: number,
    status: string,
    category: string,
    balance: number,
    referenceNumber: string,
    referralNumber: number,
    beneficiaryAccountNumber: string;
    date: string,
    transactionType: string,
    drCr: string;
    referenceNo: string,
    orderId: string;
    primaryIdentifier: string;
    secondaryIdentifier: string;
    tertiaryIdentifier: string;
    bnisorc: string;
    beneficiaryAccount: string;
}

export interface ResponseTransactionSummaryDetail {
    dateTime: string,
    transactionType: string,
    vaSource: string,
    vaDestination: string,
    principalAmount: number,
    status: string,
    fee: number,
    transactionNumber: string,
    referenceNumber: string,
    paymentMethod: string,
    bnisorc: number,
    sourceRm: string,
    primaryIdentifier: string,
    secondaryIdentifier: number,
    tertiaryIdentifier: number,
    searchResult: DataTransactionSummary[];
    detail: DataTransactionSummary[];
    orderNumberRoyalty: string;
    billerFee: string;
    bankFee: string;
    traceNumber: string;
}

export interface TransactionSummaryDetailRequest {
    id?: string;
}

function useTransactionSummaryDetailFetcher(baseUrl: string, payload: TransactionSummaryDetailRequest) {
    return apiGet<ResponseTransactionSummaryDetail>({
        baseUrl,
        path: `${apiTransactionSummary}/${payload.id}`,
        // config: { params: '' },
    });
}

export default useTransactionSummaryDetailFetcher;
