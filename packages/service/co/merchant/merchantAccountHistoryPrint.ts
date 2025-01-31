import { constructUrlSearchParams, DefaultQueryPageRequest, } from '@woi/core/api';
import { apiMerchantAccountHistoryPrint } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface AccountHistoryPrintResponseData {
    url: string;
}

interface AccountHistoryPrintResponse extends AccountHistoryPrintResponseData { }

export interface AccountHistoryPrintRequest extends DefaultQueryPageRequest {
    account_history_id: string;
    referral_number: string;
}

function useAccountHistoryPrintFetcher(baseUrl: string, payload: AccountHistoryPrintRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value?.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<AccountHistoryPrintResponse>({
        baseUrl,
        path: `${apiMerchantAccountHistoryPrint}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useAccountHistoryPrintFetcher;
