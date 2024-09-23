import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiMemberSummaryDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MemberTransactionType =
    'ADD_MONEY_VIA_NG' |
    'ADD_MONEY_VIA_SAVING_ACCOUNT' |
    'SEND_MONEY' |
    'REQUEST_MONEY' |
    'ADD_MONEY_P2P' |
    'P2M_SCAN_TO_PAY' |
    'P2P_OUTGOING_SEND_TO_BANK' |
    'CASHOUT_TO_BPI' |
    'PAYBILLS_ECPAY';

export interface MemberSummaryTransaction {
    amount: number;
    balance: number;
    billerFee: number | null;
    bnisorc: string | null;
    category: string;
    date: string;
    description: string | null;
    referalNumber: string;
    rmNumber: string | null;
    secondaryIdentifier: string | null;
    status: string;
    totalAmount: number;
    traceNumber: string | null;
    transactionType: string;
    vaDest: string;
    vaSource: string;
}

export interface DataReportMemberSummary {
    currentPage: number;
    totalElements: number;
    totalPages: number;
    transactions: MemberSummaryTransaction[];
}

export interface ResponseDataMemberSummaryDetail {
    balance: number;
    date: string;
    name: string;
    reports: DataReportMemberSummary;
    status: string;
    today: string;
    vaNumber: string;
}

export interface MemberSummaryDetailRequest extends DefaultQueryPageRequest {
    "end-date"?: string;
    phoneNumber?: string;
    size?: number;
    "start-date"?: string;
    transactionType?: MemberTransactionType[];
}

function useMemberSummaryDetailFetcher(baseUrl: string, payload: MemberSummaryDetailRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<ResponseDataMemberSummaryDetail>({
        baseUrl,
        path: `${apiMemberSummaryDetail}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useMemberSummaryDetailFetcher;
