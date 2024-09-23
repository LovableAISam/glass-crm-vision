import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { CommunityOwnerData } from "@woi/communityOwner";
import { OptionMap } from "@woi/option";
import { useBankListFetcher, useCityListFetcher, useCommunityOwnerDeactivateFetcher, useCommunityOwnerDetailFetcher, useCountryListFetcher, useCurrencyListFetcher, useProvinceListFetcher, useReferralListFetcher, useRoleListFetcher, useSCPListFetcher, useSMTPListFetcher } from "@woi/service/principal";
import { CommunityOwnerDetailData } from "@woi/service/principal/admin/communityOwner/communityOwnerDetail";
import { CommunityOwnerData as CommunityOwnerDataSelection } from '@woi/service/principal/admin/communityOwner/communityOwnerList';
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const initialComminityOwnerForm: CommunityOwnerData = {
  addresses: [],
  authenticationOtp: true,
  backgroundCard: null,
  bankAccounts: [],
  bankLogo: null,
  cardable: false,
  code: '',
  configuration: {
    billerInquiryUrl: '',
    billerInquiryProductUrl: '',
    billerPaymentUrl: '',
    billerSourceId: '',
    billerSourcePassword: '',
    billerSourcePasswordConfirm: '',
    billerSourceUser: '',
    color: '',
    scp: {
      id: null,
      merchantId: '',
      name: '',
      secretKey: '',
      userCredential: '',
    },
    smtp: {
      id: null,
      name: '',
      password: '',
      passwordConfirm: '',
      port: 0,
      server: '',
      startTls: '',
      username: '',
    },
  },
  contacts: [],
  email: '',
  isActive: false,
  activeDate: null,
  inactiveDate: null,
  loyaltyMerchantCode: '',
  loyaltyMerchantId: '',
  loyaltySupport: false,
  name: '',
  registrationNeedOtp: true,
  siupNo: '',
  usersOTP: [],
  usersPIC: [],
}

type useCommunityOwnerUpsertProps = {
  selectedData: CommunityOwnerDataSelection | null;
  onHide: () => void;
  fetchCOList: () => void;
}

function useCommunityOwnerUpsert(props: useCommunityOwnerUpsertProps) {
  const { selectedData, onHide, fetchCOList } = props;
  const formData = useForm<CommunityOwnerData>({
    defaultValues: initialComminityOwnerForm,
  });
  const { setValue, getValues } = formData;
  const [coDetailState, setCoDetailState] = useState<CommunityOwnerDetailData | null>(null);
  const { baseUrl } = useBaseUrl();
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create Community Owner' }),
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
      fetchCOList();
    }
  }

  const handleActivateDeactivate = async () => {
    const isActive = getValues('isActive');

    const confirmed = await getConfirmation(isActive ? {
      title: tCommon('confirmationDeactivateTitle', { text: 'Community Owner' }),
      message: tCommon('confirmationDeactivateDescription', { text: 'community owner' }),
      primaryText: tCommon('confirmationDeactivateYes'),
      secondaryText: tCommon('confirmationDeactivateNo'),
    } : {
      title: tCommon('confirmationActivateTitle', { text: 'Community Owner' }),
      message: tCommon('confirmationActivateDescription', { text: 'community owner' }),
      primaryText: tCommon('confirmationActivateYes'),
      secondaryText: tCommon('confirmationActivateNo'),
    });

    if (confirmed) {
      const { error } = await useCommunityOwnerDeactivateFetcher(baseUrl, selectedData!.id, {
        isActive: !isActive
      })
      if (!error) {
        enqueueSnackbar(isActive
          ? tCommon('successDeactivate', { text: 'Community Owner' })
          : tCommon('successActivate', { text: 'Community Owner' }
          ), { variant: 'info' });
        fetchCODetail(selectedData!.id)
        fetchCOList();
      } else {
        enqueueSnackbar(isActive
          ? tCommon('failedDeactivate', { text: 'Community Owner' })
          : tCommon('failedActivate', { text: 'Community Owner' }
          ), { variant: 'error' });
      }
    }
  }

  const fetchCODetail = async (id: string) => {
    const [
      coDetailResponse,
      bankListResponse,
      currencyListResponse,
      fundTypeResponse,
      contactTypeResponse,
      smtpListResponse,
      scpListResponse,
      countryListResponse,
      roleListResponse,
    ] = await Promise.all([
      useCommunityOwnerDetailFetcher(baseUrl, id),
      useBankListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useCurrencyListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useReferralListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
        type: 'FUND_TYPE'
      }),
      useReferralListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
        type: 'CONTACT_TYPE'
      }),
      useSMTPListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useSCPListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useCountryListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      }),
      useRoleListFetcher(baseUrl, {
        page: 0,
        limit: 1000,
      })
    ]);

    const { result: resultBankList, error: errorBankList } = bankListResponse;
    let bankOptions: OptionMap<string>[] = [];
    if (resultBankList && !errorBankList) {
      bankOptions = resultBankList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultCurrencyList, error: errorCurrencyList } = currencyListResponse;
    let currencyOptions: OptionMap<string>[] = [];
    if (resultCurrencyList && !errorCurrencyList) {
      currencyOptions = resultCurrencyList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultFundTypeList, error: errorFundTypeList } = fundTypeResponse;
    let fundTypeOptions: OptionMap<string>[] = [];
    if (resultFundTypeList && !errorFundTypeList) {
      fundTypeOptions = resultFundTypeList.data.map(data => ({
        label: data.code,
        value: data.value,
      }));
    }

    const { result: resultContactTypeList, error: errorContactTypeList } = contactTypeResponse;
    let contactTypeOptions: OptionMap<string>[] = [];
    if (resultContactTypeList && !errorContactTypeList) {
      contactTypeOptions = resultContactTypeList.data.map(data => ({
        label: data.code,
        value: data.value,
      }));
    }

    const { result: resultSMTPList, error: errorSMTPList } = smtpListResponse;
    let smtpOptions: OptionMap<string>[] = [];
    if (resultSMTPList && !errorSMTPList) {
      smtpOptions = resultSMTPList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultSCPList, error: errorSCPList } = scpListResponse;
    let scpOptions: OptionMap<string>[] = [];
    if (resultSCPList && !errorSCPList) {
      scpOptions = resultSCPList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultCountryList, error: errorCountryList } = countryListResponse;
    let countryOptions: OptionMap<string>[] = [];
    if (resultCountryList && !errorCountryList) {
      countryOptions = resultCountryList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultRoleList, error: errorRoleList } = roleListResponse;
    let roleOptions: OptionMap<string>[] = [];
    if (resultRoleList && !errorRoleList) {
      roleOptions = resultRoleList.data.map(data => ({
        label: data.name,
        value: data.id,
      }));
    }

    const { result: resultCODetail, error: errorCODetail } = coDetailResponse;
    if (resultCODetail && !errorCODetail) {
      setCoDetailState(resultCODetail);

      setValue('code', resultCODetail.code);
      setValue('name', resultCODetail.name);
      setValue('isActive', resultCODetail.isActive);
      resultCODetail.addresses.forEach(async (address, index) => {
        const { result: resultProvinceList, error: errorProvinceList } = await useProvinceListFetcher(baseUrl, {
          'country-id': address.countryId,
          page: 0,
          limit: 1000,
        });
        let provinceOptions: OptionMap<string>[] = [];
        if (resultProvinceList && !errorProvinceList) {
          provinceOptions = resultProvinceList.data.map(data => ({
            label: data.name,
            value: data.id,
          }));
        }

        const { result: resultCityList, error: errorCityList } = await useCityListFetcher(baseUrl, {
          'province-id': address.provinceId,
          page: 0,
          limit: 1000,
        });
        let cityOptions: OptionMap<string>[] = [];
        if (resultCityList && !errorCityList) {
          cityOptions = resultCityList.data.map(data => ({
            label: data.name,
            value: data.id,
          }));
        }

        setValue(`addresses.${index}`, {
          address: address.address,
          cityId: cityOptions.find(city => city.value === address.cityId) || null,
          countryId: countryOptions.find(country => country.value === address.countryId) || null,
          postalCode: address.postalCode,
          provinceId: provinceOptions.find(province => province.value === address.provinceId) || null,
        });
      });
      setValue('authenticationOtp', resultCODetail.authenticationOtp);
      setValue('backgroundCard', { docPath: resultCODetail.backgroundCard });
      setValue('bankAccounts', resultCODetail.bankAccounts.map(bankAccount => ({
        bankId: bankOptions.find(bank => bank.value === bankAccount.bankId) || null,
        bin: bankAccount.bin,
        currencyId: currencyOptions.find(currency => currency.value === bankAccount.currencyId) || null,
        fundType: fundTypeOptions.find(fundType => fundType.value === bankAccount.fundType) || null,
        name: bankAccount.name,
        number: bankAccount.number,
        vaLength: bankAccount.vaLength,
      })));
      setValue('bankLogo', { docPath: resultCODetail.bankLogo });
      setValue('cardable', resultCODetail.cardable);
      if (resultCODetail.configuration) {
        setValue('configuration.billerInquiryUrl', resultCODetail.configuration.billerInquiryUrl);
        setValue('configuration.billerInquiryProductUrl', resultCODetail.configuration.billerInquiryProductUrl);
        setValue('configuration.billerPaymentUrl', resultCODetail.configuration.billerPaymentUrl);
        setValue('configuration.billerSourceId', resultCODetail.configuration.billerSourceId);
        setValue('configuration.billerSourcePassword', resultCODetail.configuration.billerSourcePassword);
        setValue('configuration.billerSourcePasswordConfirm', resultCODetail.configuration.billerSourcePassword);
        setValue('configuration.billerSourceUser', resultCODetail.configuration.billerSourceUser);
        setValue('configuration.color', resultCODetail.configuration.color);
        setValue('configuration.scp.id', scpOptions.find(scp => scp.value === resultCODetail.configuration.scp.id) || null);
        setValue('configuration.scp.merchantId', resultCODetail.configuration.scp.merchantId);
        setValue('configuration.scp.name', resultCODetail.configuration.scp.name);
        setValue('configuration.scp.secretKey', resultCODetail.configuration.scp.secretKey);
        setValue('configuration.scp.userCredential', resultCODetail.configuration.scp.userCredential);
        setValue('configuration.smtp.id', smtpOptions.find(smtp => smtp.value === resultCODetail.configuration.smtp.id) || null);
        setValue('configuration.smtp.name', resultCODetail.configuration.smtp.name);
        setValue('configuration.smtp.password', resultCODetail.configuration.smtp.password);
        setValue('configuration.smtp.passwordConfirm', resultCODetail.configuration.smtp.password);
        setValue('configuration.smtp.port', resultCODetail.configuration.smtp.port);
        setValue('configuration.smtp.server', resultCODetail.configuration.smtp.server);
        setValue('configuration.smtp.startTls', resultCODetail.configuration.smtp.startTls);
        setValue('configuration.smtp.username', resultCODetail.configuration.smtp.username);
      }
      setValue('contacts', resultCODetail.contacts.map(contact => ({
        number: contact.number,
        type: contactTypeOptions.find(contactType => contactType.value === contact.type) || null,
      })));
      setValue('email', resultCODetail.email);
      setValue('activeDate', resultCODetail.activeDate ? new Date(resultCODetail.activeDate) : null);
      setValue('inactiveDate', resultCODetail.inactiveDate ? new Date(resultCODetail.inactiveDate) : null);
      setValue('loyaltyMerchantCode', resultCODetail.loyaltyMerchantCode);
      setValue('loyaltyMerchantId', resultCODetail.loyaltyMerchantId);
      setValue('loyaltySupport', resultCODetail.loyaltySupport);
      setValue('registrationNeedOtp', resultCODetail.registrationNeedOtp);
      setValue('siupNo', resultCODetail.siupNo);
      setValue('usersOTP', resultCODetail.usersOTP.map(user => ({
        channel: user.channel,
        division: user.division,
        password: user.password,
        passwordConfirm: user.password,
        sender: user.sender,
        username: user.username,
      })));
      setValue('usersPIC', resultCODetail.usersPIC.map(user => ({
        id: user.id,
        activeDate: user.activeDate ? new Date(user.activeDate) : null,
        inactiveDate: user.inactiveDate ? new Date(user.inactiveDate) : null,
        isLocked: user.isLocked || false,
        password: user.password,
        passwordConfirm: user.password,
        username: user.username,
        role: roleOptions.find(role => role.value === user.roleSecureId) || null
      })));
    }
  }

  useEffect(() => {
    if (selectedData) {
      fetchCODetail(selectedData.id);
    }
  }, [selectedData])

  return {
    coDetailState,
    formData,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useCommunityOwnerUpsert;