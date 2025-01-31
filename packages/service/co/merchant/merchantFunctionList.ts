import { apiMerchantFunctionList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantFunctionData {
    id: string;
    function: string;
}

export interface MerchantFunctionList {
    merchantfunctionList: MerchantFunctionData[];
}

function useMerchantFunctionListFetcher(baseUrl: string) {
    return apiGet<MerchantFunctionList>({
        baseUrl,
        path: `${apiMerchantFunctionList}`,
    });
}

export default useMerchantFunctionListFetcher;
