import { apiMerchantCategoryList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantCategoryList {
    id: string;
    definition: string;
    code: string;
}

function useMerchantCategoryListFetcher(baseUrl: string) {
    return apiGet<MerchantCategoryList[]>({
        baseUrl,
        path: `${apiMerchantCategoryList}`,
    });
}

export default useMerchantCategoryListFetcher;
