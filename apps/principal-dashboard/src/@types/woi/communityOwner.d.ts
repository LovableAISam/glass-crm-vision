declare module '@woi/communityOwner' {
  import { OptionMap } from '@woi/option';
  import { UploadDocumentData } from '@woi/uploadDocument';

  interface CommunityOwnerAddress {
    address: string;
    cityId: OptionMap<string> | null;
    countryId: OptionMap<string> | null;
    postalCode: string;
    provinceId: OptionMap<string> | null;
  }

  interface CommunityOwnerBankAccount {
    bankId: OptionMap<string> | null;
    bin: string;
    currencyId: OptionMap<string> | null;
    fundType: OptionMap<string> | null;
    name: string;
    number: string;
    vaLength: string;
  }

  interface CommunityOwnerConfigurationSCP {
    id: OptionMap<string> | null;
    merchantId: string;
    name: string;
    secretKey: string;
    userCredential: string;
  }

  interface CommunityOwnerConfigurationSMTP {
    id: OptionMap<string> | null;
    name: string;
    password: string;
    passwordConfirm: string;
    port: number;
    server: string;
    startTls: string;
    username: string;
  }

  interface CommunityOwnerConfiguration {
    billerInquiryUrl: string;
    billerInquiryProductUrl: string;
    billerPaymentUrl: string;
    billerSourceId: string;
    billerSourcePassword: string;
    billerSourcePasswordConfirm: string;
    billerSourceUser: string;
    color: string;
    scp: CommunityOwnerConfigurationSCP;
    smtp: CommunityOwnerConfigurationSMTP;
  }

  interface CommunityOwnerContact {
    number: string;
    type: OptionMap<string> | null;
  }

  interface CommunityOwnerUserOTP {
    channel: string;
    division: string;
    password: string;
    passwordConfirm: string;
    sender: string;
    username: string;
  }

  interface CommunityOwnerUserPIC {
    id: string;
    username: string;
    role: OptionMap<string> | null;
    password: string;
    passwordConfirm: string;
    isLocked: boolean;
    activeDate: Date | null;
    inactiveDate: Date | null;
  }

  export interface CommunityOwnerData {
    addresses: CommunityOwnerAddress[];
    authenticationOtp: boolean;
    backgroundCard: UploadDocumentData | null
    bankAccounts: CommunityOwnerBankAccount[];
    bankLogo: UploadDocumentData | null
    cardable: boolean;
    code: string;
    configuration: CommunityOwnerConfiguration;
    contacts: CommunityOwnerContact[],
    email: string;
    isActive: boolean;
    activeDate: Date | null;
    inactiveDate: Date | null;
    loyaltyMerchantCode: string;
    loyaltyMerchantId: string;
    loyaltySupport: boolean;
    name: string;
    registrationNeedOtp: boolean;
    siupNo: string;
    usersOTP: CommunityOwnerUserOTP[];
    usersPIC: CommunityOwnerUserPIC[];
  }
}