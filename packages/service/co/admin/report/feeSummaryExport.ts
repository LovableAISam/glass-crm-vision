import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadFeeSummaryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { FeeTransactionType } from "./feeSummary";

interface FeeSummaryExportResponseData {
    url: string;
}

interface FeeSummaryExportResponse extends FeeSummaryExportResponseData { }

export interface FeeSummaryExportRequest {
    endAt?: string;
    sort?: string;
    startAt?: string;
    transactionType?: FeeTransactionType[];
    fileExtension?: string;
}

function useFeeSummaryExportFetcher(baseUrl: string, payload: FeeSummaryExportRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<FeeSummaryExportResponse>({
        baseUrl,
        path: `${apiDownloadFeeSummaryExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useFeeSummaryExportFetcher;
