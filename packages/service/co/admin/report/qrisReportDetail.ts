import { constructUrlSearchParams } from '@woi/core/api';
import { apiQRISReportAllTransaction } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface QRISReportData {
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

export interface QRISReportResponse {
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
    searchResult: QRISReportData[];
    detail: QRISReportData[];
    orderNumberRoyalty: string;
    billerFee: string;
    bankFee: string;
    traceNumber: string;
}

export interface QRISReportRequest {
    transactionId?: string;
}

function useQRISReportFetcher(baseUrl: string, payload: QRISReportRequest) {
    return apiGet<QRISReportResponse>({
        baseUrl,
        path: `${apiQRISReportAllTransaction}`,
        config: { params: constructUrlSearchParams(payload) },
    });
}

export default useQRISReportFetcher;