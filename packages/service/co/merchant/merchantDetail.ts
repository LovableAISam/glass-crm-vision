import { apiMerchantDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface MerchantDetail extends ResponseData {
  failure: false;
  status: {
    code: string;
    text: string;
    type: string;
  };
  cooperationAgreementList: [
    {
      name: string;
      position: string;
    },
    {
      name: string;
      position: string;
    },
  ];
  id: string;
  merchantCompleteName: string;
  merchantCode: string;
  merchantType: string;
  merchantCategory: number;
  merchantCategoryCodeName: string;
  email: string;
  phoneNumber: string;
  balance: number;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  isActive: true,
  photoLogo: string;
  countryCode: string;
  principalId: string;
  password: string;
  nikOrNib: string;
  merchantReleaseDate: string;
  address: string;
  fee: string;
  urlPaymentDirectSuccess: string;
  urlPaymentDirectFailed: string;
  comparisonOfTransactionFrom: number;
  comparisonOfTransactionTo: number;
  bankName: string;
  picEmailOfFinance: string;
  picNameOfFinance: string;
  accountName: string;
  accountNumber: string;
  paymentNotificationUrl: string;
  clientId: string;
  publicKey: string;
  secretKey: string;
  authTokenRequestUrl: string;
  isQris: boolean;
  merchantFuntionId: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  merchantShortName: string;
  xpartnerId: string;
  mcc: string;
  merchantCriteria: string;
  merchantCriteriaName: string;
  merchantCriteriaSecureId: string;
  isTag51Only: false,
  nmId: string;
  merchantBrand: string;
  isIndividualBusiness: string;
  birthDate: string;
  npwp: string;
  addressProvince: string;
  webSite: string;
  socialMedia: string;
  urlAccessTokenB2B: string;
  merchantLocation: string;
  merchantAddressCorrespondence: string;
  merchantAddressCorrespondencePostalCode: string;
  merchantAddressCorrespondenceProvince: string;
  merchantAddressCorrespondenceDistrict: string;
  merchantAddressCorrespondenceCity: string;
  merchantAddressCorrespondenceVillage: string;
  addressCity: string;
  identityExpiry: string;
  identityType: string;
  identityNumber: string;
  passportExpiryDate: string;
  postalCode: string;
  mdrPercentage: number;
  mdrFixed: number;
  addressDistrict: string;
  addressVillage: string;
  mpan: string;
  terminalId: string;
  qrType: string;
  tipsType: string;
  percentageTips: number;
  fixedTips: number;
  qrStaticAmount: number;
  grossRevenue: number;
  mdrMinAmount: number;
  mdrBottom: number;
  mdrUpper: number;
  mdrMinimum: number;
  channelId: string;
}

function useMerchantDetailFetcher(baseUrl: string, id: string) {
  return apiGet<MerchantDetail>({
    baseUrl,
    path: `${apiMerchantDetail}/${id}`,
  });
}

export default useMerchantDetailFetcher;
