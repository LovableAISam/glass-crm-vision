import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiFundBalance } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type UserType =
    'LITE' |
    'MEMBER' |
    'PRO';

export interface UserFundBalanceData {
    enrollmentDate: string;
    id: number;
    lastMonthCashInBpi: number;
    lastMonthCashInNonBpi: number;
    lastMonthFundBalance: number;
    lastWeekCashInBpi: number;
    lastWeekCashInNonBpi: number;
    lastWeekFundBalance: number;
    numLinkBank: string;
    numLinkCredit: string;
    numLinkDebit: string;
    numLinkWallet: string;
    phoneNumber: string;
    reportDateFundBalance: number;
    rmNumber: string;
    startOfYearFundBalance: number;
    thisWeekCashInBpi: number;
    thisWeekCashInNonBpi: number;
    totalCashInBpi: number;
    totalCashInNonBpi: number;
    type: UserType;
    ytdBpi: number;
    ytdNonBpi: number;
}

export interface ResponseDataUserFundBalance {
    fundBalanceLists: UserFundBalanceData[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
}

export interface UserFundBalanceRequest extends DefaultQueryPageRequest {
    endAt?: string;
    memberId?: string;
    phoneNumber?: string;
    rmNumber?: string;
    size?: number;
    startAt?: string;
}

function userFundBalanceFetcher(baseUrl: string, payload: UserFundBalanceRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<ResponseDataUserFundBalance>({
        baseUrl,
        path: `${apiFundBalance}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default userFundBalanceFetcher;
