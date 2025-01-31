import { constructUrlSearchParams, DefaultQueryPageRequest, } from '@woi/core/api';
import { apiMerchantAccountHistoryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface AccountHistoryExportResponseData {
    url: string;
}

interface AccountHistoryExportResponse extends AccountHistoryExportResponseData { }

export interface AccountHistoryExportRequest extends DefaultQueryPageRequest {
    merchantCode: string;
    'co code'?: string;
    'debit credit'?: string;
    'Start Date'?: string;
    'End Date'?: string;
    'qris type'?: string[];
    'transaction type'?: string[];
    fileExtension?: string;
    'balance brutto'?: string;
    'balance nett'?: string;
}

function useAccountHistoryExportFetcher(baseUrl: string, payload: AccountHistoryExportRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<AccountHistoryExportResponse>({
        baseUrl,
        path: `${apiMerchantAccountHistoryExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useAccountHistoryExportFetcher;
