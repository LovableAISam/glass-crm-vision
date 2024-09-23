import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadBankAccountSummaryExport, } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface BankAccountSummaryExportResponseData {
    url: string;
}

interface BankAccountSummaryExportResponse extends BankAccountSummaryExportResponseData { }

export interface BankAccountSummaryExportRequest {
    account?: string;
    endAt?: string;
    extension?: string;
    sort?: string;
    startAt?: string;
}

function useBankAccountSummaryExportFetcher(baseUrl: string, payload: BankAccountSummaryExportRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<BankAccountSummaryExportResponse>({
        baseUrl,
        path: `${apiDownloadBankAccountSummaryExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useBankAccountSummaryExportFetcher;
