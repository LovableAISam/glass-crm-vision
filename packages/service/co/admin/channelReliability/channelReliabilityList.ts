import { constructUrlSearchParams } from '@woi/core/api';
import { apiChannelReliability } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface ResponseChannelReliability {
    attemptFinancial: number;
    attemptFinancialMember: number;
    attemptedNonFinancialMember: number;
    attemptedUserLogin: number;
    averageFinancialTransaction: number;
    averageNonFinancialTransaction: number;
    avgAttemptsFinancialPerUser: number;
    avgAttemptsLoginPerUser: number;
    avgAttemptsNonFinancialPerUser: number;
    loginAttempts: number;
    nonFinancialAttempt: number;
    nonFinancialSuccess: number;
    statsAverageMinsInApp: number;
    statsSuccessFinancialTransaction: number;
    statsSuccessLogin: number;
    statsSuccessNonFinancialTransaction: number;
    statsTotalMinsFinancial: number;
    statsTotalMinsLoginLogout: number;
    statsTotalMinsNonFinancial: number;
    succesLoginPercentage: number;
    successFinancial: number;
    successFinancialPercentage: number;
    successNonFinancialPercentage: number;
    successUserFinancialAttempt: number;
    successUserLoginAttempt: number;
    successUserNonFinancialAttempt: number;
    successfullLogin: number;
}

export interface ChannelReliabilityRequest {
    from?: string;
    to?: string;
}

function userChannelReliabilityFetcher(baseUrl: string, payload: ChannelReliabilityRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<ResponseChannelReliability>({
        baseUrl,
        path: `${apiChannelReliability}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default userChannelReliabilityFetcher;
