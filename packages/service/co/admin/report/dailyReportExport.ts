import { apiDownloadDailySummaryExport, } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface DailyReportExportResponseData {
    url: string;
}

interface DailyReportExportResponse extends DailyReportExportResponseData { }

export interface DailyReportExportRequest {
    id?: number | null;
}

function useDailyReportExportFetcher(baseUrl: string, payload: DailyReportExportRequest) {

    return apiGet<DailyReportExportResponse>({
        baseUrl,
        path: `${apiDownloadDailySummaryExport}/${payload.id}`,
        config: {},
    });
}

export default useDailyReportExportFetcher;
