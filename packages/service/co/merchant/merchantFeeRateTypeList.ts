import { ResultData } from '@woi/core/api';
import { apiMerchantFeeRateType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface FeeRateTypeData {
    secureId: string;
    description: string;
}

interface FeeRateTypeListResponse extends ResultData<FeeRateTypeData[]> { }

function useMerchantFeeRateTypeListFetcher(baseUrl: string) {
    return apiGet<FeeRateTypeListResponse>({
        baseUrl,
        path: `${apiMerchantFeeRateType}`,
    });
}

export default useMerchantFeeRateTypeListFetcher;
