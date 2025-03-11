import { constructUrlSearchParams, DefaultQueryPageRequest, } from '@woi/core/api';
import { apiDownloadQRISSettlementExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface QRISSettlementResponseData {
    url: string;
}

interface QRISSettlementResponse extends QRISSettlementResponseData { }

export interface QRISSettlementRequest extends DefaultQueryPageRequest {
    startAt?: string;
    endAt?: string;
    size?: number;
    merchantName?: string;
    status?: string[];
    mcc?: string[];
    fileExtension?: string;
}

function useQRISSettlementExportFetcher(baseUrl: string, payload: QRISSettlementRequest) {
    const request: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value !== "" && value.length !== 0) {
            request[key] = value;
        }
    }

    return apiGet<QRISSettlementResponse>({
        baseUrl,
        path: `${apiDownloadQRISSettlementExport}`,
        config: { params: constructUrlSearchParams(request) },
    });
}

export default useQRISSettlementExportFetcher;
