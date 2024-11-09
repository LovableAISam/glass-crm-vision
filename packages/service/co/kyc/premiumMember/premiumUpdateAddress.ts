import { ResponseData } from '@woi/core/api';
import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface UpdateResponse extends ResponseData { }

export interface UserUpdateRequest {
    address: string;
    addressDomicile: string;
    cityId: string;
    cityIdDomicile: string;
    postalCode: number;
    postalCodeDomicile: number;
    provinceId: string;
    provinceIdDomicile: string;
    subDistrictId: string;
    subDistrictIdDomicile: string;
    urbanVillageId: string;
    urbanVillageIdDomicile: string;
    isResidenceSameWithIdentityCard: boolean;
}

function useKYCUpdateAddressFetcher(baseUrl: string, id: string, payload: UserUpdateRequest) {
    return apiPut<UpdateResponse>({
        baseUrl,
        path: `${apiKycPremiumMember}/${id}`,
        payload,
    });
}

export default useKYCUpdateAddressFetcher;
