import apiGet from '@woi/common/api/apiGet';
import { apiQRISSettlementDetail } from '@woi/common/meta/apiPaths/coApiPaths';

interface QRISSettlementDetailExportResponseData {
    url: string;
}

interface QRISSettlementDetailExportResponse extends QRISSettlementDetailExportResponseData { }

export interface QRISSettlementDetailExportRequest {
    id: string;
}

function useQRISSettelementDetailExportFetcher(baseUrl: string, payload: QRISSettlementDetailExportRequest) {
    return apiGet<QRISSettlementDetailExportResponse>({
        baseUrl,
        path: `${apiQRISSettlementDetail}/${payload.id}`,
    });
}

export default useQRISSettelementDetailExportFetcher;
