import { apiMerchantCategoryList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { constructUrlSearchParams } from "@woi/core/api";

export interface MerchantCategoryList {
    id: string;
    definition: string;
    code: string;
}

export interface MerchantCategoryRequest {
    qrTypeId?: string;
}

function useMerchantCategoryListFetcher(baseUrl: string, payload?: MerchantCategoryRequest) {
    return apiGet<MerchantCategoryList[]>({
        baseUrl,
        path: `${apiMerchantCategoryList}`,
        config: { params: constructUrlSearchParams(payload) },
    });
}

export default useMerchantCategoryListFetcher;
