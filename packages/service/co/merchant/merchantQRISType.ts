import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMerchantQRISType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface QrisTypeListTypeData extends ResponseData {
    qrisType: string[];
}

export interface QrisTypeListResponse {
    qrisType: string[];
}

export interface QrisTypeListRequest extends DefaultQueryPageRequest {
    qrisType: string[];
}

function useMerchantQRISTypeListFetcher(baseUrl: string) {
    return apiGet<QrisTypeListResponse>({
        baseUrl,
        path: `${apiMerchantQRISType}`,
        config: { params: constructUrlSearchParams({}) },
    });
}

export default useMerchantQRISTypeListFetcher;
