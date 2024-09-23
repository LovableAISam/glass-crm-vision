import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiFeeSummary } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type FeeTransactionType =
    'ADD_MONEY_VIA_NG' |
    'ADD_MONEY_VIA_SAVING_ACCOUNT' |
    'SEND_MONEY' |
    'REQUEST_MONEY' |
    'ADD_MONEY_P2P' |
    'P2M_SCAN_TO_PAY' |
    'P2P_OUTGOING_SEND_TO_BANK' |
    'CASHOUT_TO_BPI' |
    'PAYBILLS_ECPAY';

export interface FeeSummaryTransaction {
    dateTime: string;
    transactionType: string;
    vaSource: string;
    rmNumber: string;
    vaDestination: string | null;
    feeCommision: number;
    dbCr: string;
    status: string;
    balance: number;
    referenceNumber: string;
    orderId: string;
    description: string;
}

export interface ResponseDataFeeSummary {
    transactions: FeeSummaryTransaction[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
}

export interface FeeSummaryRequest extends DefaultQueryPageRequest {
    endAt?: string;
    size?: number;
    startAt?: string;
    transactionType?: FeeTransactionType[];
}

function useFeeSummaryFetcher(baseUrl: string, payload: FeeSummaryRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<ResponseDataFeeSummary>({
        baseUrl,
        path: `${apiFeeSummary}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useFeeSummaryFetcher;
