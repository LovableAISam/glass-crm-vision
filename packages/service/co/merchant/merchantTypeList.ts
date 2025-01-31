import { apiMerchantTypeList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface BankData {
    id: string;
    type: string;
}

function useMerchantTypeListFetcher(baseUrl: string) {
    return apiGet<BankData[]>({
        baseUrl,
        path: `${apiMerchantTypeList}`,
    });
}

export default useMerchantTypeListFetcher;
