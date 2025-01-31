import { constructUrlSearchParams } from '@woi/core/api';
import { apiMerchantCategoryCodeList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantCategoryCodeRequest {
    description?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface MerchantCategoryCodeList {
    id: string;
    description: string;
    mcc: string;
}

interface ResultData {
    mccList: MerchantCategoryCodeList[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
}

function useMerchantCategoryCodeListFetcher(baseUrl: string, payload: MerchantCategoryCodeRequest) {
    return apiGet<ResultData>({
        baseUrl,
        path: `${apiMerchantCategoryCodeList}`,
        config: { params: constructUrlSearchParams(payload) },
    });
}

export default useMerchantCategoryCodeListFetcher;
