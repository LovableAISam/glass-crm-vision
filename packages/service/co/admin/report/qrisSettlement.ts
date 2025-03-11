import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiQRISSettlement } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface QRISSettlementRequest extends DefaultQueryPageRequest {
    startAt?: string;
    endAt?: string;
    size?: number;
    merchantName?: string;
    status?: string[];
    mcc?: string[];
}

export interface QRISSettlement {
    date: string;
    merchantCode: string;
    merchantShortName: string;
    accountNumber: string;
    bankName: string;
    nettMerchantBalance: number;
    mcc: string;
    mdrPercentage: string;
    grossTotalTransaction: number;
    mdrAmount: number;
    status: string;
    qrisSettlementId: string;
    feeAcquiringAmount: number;
    feeAcquiringPercentage: number;
    feeIssuerPercentage: number;
    feeIssuerAmount: number;
    coFeeTotal: number;

    // belum ada
    balance: number;
}

export interface ResponseDataQRISSettlement {
    data: QRISSettlement[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
}

function useQRISSettlementFetcher(baseUrl: string, payload: QRISSettlementRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<ResponseDataQRISSettlement>({
        baseUrl,
        path: `${apiQRISSettlement}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useQRISSettlementFetcher;
