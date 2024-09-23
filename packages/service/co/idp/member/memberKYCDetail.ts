import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMemberKYCDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MemberKYCDetailData extends ResponseData {
  addressId: string;
  barangay: string;
  city: string;
  cityOfBirth: string;
  countryOfBirth: string;
  countryOfResidence: string;
  dateOfBirth: string;
  employer: string;
  gender: string;
  idNumber: string;
  industryId: string;
  jobTitle: string;
  motherMaidenName: string;
  name: string;
  province: string;
  referralCode: string;
  residenceAddressId: string;
  sourceOfIncome: string;
  streetAddress: string;
  townDistrictBirth: string;
  zipCode: string;
  email: string;
  idType: string;
  transactionDate: string;
}

export interface MemberKYCDetailRequest extends DefaultQueryPageRequest {
  phoneNumber?: string | null;
}

function useMemberKYCDetailFetcher(baseUrl: string, payload: MemberKYCDetailRequest) {
  return apiGet<MemberKYCDetailData>({
    baseUrl,
    path: `${apiMemberKYCDetail}/${payload.phoneNumber}`,
    config: { params: constructUrlSearchParams("") },
  });
}

export default useMemberKYCDetailFetcher;
