import apiGet from '@woi/common/api/apiGet';
import { apiCustomerProfile } from '@woi/common/meta/apiPaths/coApiPaths';

export interface CustomerProfile {
  natureOfBusiness: {
    natureOfBusinessCode: string;
    natureOfBusinessDescription: string;
    referenceFlag: string;
  }[];
  jobTitle: {
    jobTitleCode: string;
    jobTitleDescription: string;
    referenceFlag: string;
  }[];
  sourceOfFunds: {
    sourceOfFundsCode: string;
    sourceOfFundsDescription: string;
    referenceFlag: string;
  }[];
  gender: {
    genderCode: string;
    genderDescription: string;
  }[];
  maritalStatus: {
    maritalStatusCode: string;
    maritalStatusDescription: string;
  }[];
}

function useCustomerProfileFetcher(baseUrl: string) {
  return apiGet<CustomerProfile>({
    baseUrl,
    path: `${apiCustomerProfile}`,
  });
}

export default useCustomerProfileFetcher;
