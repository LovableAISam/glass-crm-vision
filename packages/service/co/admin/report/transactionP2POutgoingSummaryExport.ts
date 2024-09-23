import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadTransactionP2POutgoingSummaryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionSummaryP2pExportResponseData {
    url: string;
}

interface TransactionSummaryP2pExportResponse extends TransactionSummaryP2pExportResponseData { }

export interface TransactionP2PSummaryExportRequest {
    endAt?: string;
    sort?: string;
    startAt?: string;
    transactionType?: string[];
    status?: string[];
    fileExtension?: string;
}

function useTransactionP2POutgoingSummaryExportFetcher(baseUrl: string, payload: TransactionP2PSummaryExportRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<TransactionSummaryP2pExportResponse>({
        baseUrl,
        path: `${apiDownloadTransactionP2POutgoingSummaryExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useTransactionP2POutgoingSummaryExportFetcher;
