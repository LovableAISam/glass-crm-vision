import { constructUrlSearchParams } from '@woi/core/api';
import { apiMerchantLocationList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface LocationListData {
    id: string;
    name: string;
}

interface ResultData {
    merchantLocationList: LocationListData[];
}

function useMerchantLocationListFetcher(baseUrl: string) {
    return apiGet<ResultData>({
        baseUrl,
        path: `${apiMerchantLocationList}`,
        config: { params: constructUrlSearchParams({}) },
    });
}

export default useMerchantLocationListFetcher;
