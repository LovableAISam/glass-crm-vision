import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadTransactionSummaryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionSummaryExportResponseData {
    url: string;
}

interface TransactionSummaryExportResponse extends TransactionSummaryExportResponseData { }

export interface TransactionSummaryExportRequest {
    endAt?: string;
    sort?: string;
    startAt?: string;
    transactionType?: string[];
    status?: string[];
    fileExtension?: string;
}

function useTransactionSummaryExportFetcher(baseUrl: string, payload: TransactionSummaryExportRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<TransactionSummaryExportResponse>({
        baseUrl,
        path: `${apiDownloadTransactionSummaryExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useTransactionSummaryExportFetcher;
