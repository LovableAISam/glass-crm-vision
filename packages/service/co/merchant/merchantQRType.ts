import { constructUrlSearchParams } from '@woi/core/api';
import { apiMerchantQRType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface ResultData {
    qrType: string[];
}

function useMerchantQRTypeListFetcher(baseUrl: string) {
    return apiGet<ResultData>({
        baseUrl,
        path: `${apiMerchantQRType}`,
        config: { params: constructUrlSearchParams({}) },
    });
}

export default useMerchantQRTypeListFetcher;
