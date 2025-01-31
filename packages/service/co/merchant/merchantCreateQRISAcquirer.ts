// Hooks & Utils
import { DefaultRequest } from '@woi/core/api';
import { apiMerchantCreate } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface MerchantQRISAcquirerCreateResponse { }

export type CooperationAgreement = {
  jabatan: string;
  name: string;
};

export interface MerchantCreateQRISAcquirerRequest extends DefaultRequest {
  accountName?: string;
  accountNumber?: string;
  active?: boolean,
  address?: string;
  postalCode?: string;
  addressCity?: string;
  addressProvince?: string;
  authTokenUrl?: string;
  bankName?: string;
  clientId?: string;
  comparisonTransactionFrom?: string;
  comparisonTransactionTo?: string;
  cooperationAgreementList?: CooperationAgreement[];
  countryCode?: string;
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  email?: string;
  grossRevenue?: string;
  idNumber?: string;
  idType?: string; // KTP
  isIndividualBusiness?: boolean,
  isQrisTag51?: boolean,
  mdrPercentage?: string;
  merchantAddressCorrespondence?: string;
  merchantAddressCorrespondenceCity?: string;
  merchantAddressCorrespondencePostalCode?: string;
  merchantAddressCorrespondenceProvince?: string;
  merchantBrand?: string;
  merchantOtherLocation?: string;
  merchantCategory?: string;
  merchantCodeCategory?: string;
  merchantCompleteName?: string;
  merchantFunction?: string;
  merchantLocation?: string;
  merchantReleaseDate?: string;
  merchantShortName?: string;
  merchantType?: string;
  nmid?: string;
  npwp?: string;
  passportExpiryDate?: string;
  password?: string;
  paymentNotifUrl?: string;
  phoneNumber?: string;
  photoLogo?: string;
  publicKey?: string;
  qrType?: string;
  secretKey?: string;
  settlementPicEmail?: string;
  settlementPicName?: string;
  socialMedia?: string;
  tipsAmount?: string;
  tipsPercentage?: string;
  tipsType?: string;
  website?: string;
  dateOfBirth?: string;
  terminalId?: number,
  nikOrNib?: string,
  addressDistrict?: string,
  addressVillage?: string,
  merchantAddressCorrespondenceDistrict?: string,
  merchantAddressCorrespondenceVillage?: string,
  urlPaymentDirectSuccess?: string,
  urlPaymentDirectFailed?: string,
  channelId?: string,
  fee?: string,
}

function userMerchantCreateQRISAcquirerFetcher(baseUrl: string, payload: MerchantCreateQRISAcquirerRequest) {
  return apiPost<MerchantQRISAcquirerCreateResponse>({
    baseUrl,
    path: `${apiMerchantCreate}`,
    payload,
  });
}

export default userMerchantCreateQRISAcquirerFetcher;
