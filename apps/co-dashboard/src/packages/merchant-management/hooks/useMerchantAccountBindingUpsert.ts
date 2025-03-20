// Cores
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Hooks & Utils
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { TextGetter } from "@woi/core";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useCityListFetcher, useKecamatanListFetcher, useKelurahanListFetcher, useMerchantCategoryCodeListFetcher, useMerchantCategoryListFetcher, useMerchantLocationListFetcher, useMerchantQRTypeListFetcher, useMerchantTypeListFetcher, useMerchantUpdateQRISAcquirerFetcher, useProvinceListFetcher, userMerchantCreateQRISAcquirerFetcher } from "@woi/service/co";

// Types & Consts
import { DatePeriod } from "@woi/core/utils/date/types";
import { OptionMap } from "@woi/option";
import { MerchantDetail } from "@woi/service/co/merchant/merchantDetail";
import { MerchantDataList } from "@woi/service/co/merchant/merchantList";
import { BankStatus } from "@woi/service/principal/admin/bank/bankList";
import { MerchantCreateQRISAcquirerRequest } from "@woi/service/co/merchant/merchantCreateQRISAcquirer";
import { MerchantCategoryCodeRequest } from "@woi/service/co/merchant/merchantCategoryListCode";
import { MerchantUpdateQRISAcquirerRequest } from "@woi/service/co/merchant/merchantUpdateQRISAcquirer";

export interface MerchantForm {
    // Merchant Data
    merchantName: string;
    nib: string;
    merchantEmail: string;
    password: string;
    websiteMerchant: string;
    paymentNotifyUrl: string;
    secretKey: string;
    clientId: string;
    urlAccessTokenB2B: string;
    urlPaymentDirectSuccess: string;
    urlPaymentDirectFailed: string;
    publicKey: string;
    channelID: string;
    effectiveDate: DatePeriod;
    fee: string;
    merchantAddress: string;
    province: OptionMap<string> | null;
    city: OptionMap<string> | null;
    district: OptionMap<string> | null;
    village: OptionMap<string> | null;
    postalCode: string;
    phoneNumber: string;

    // Settlement Information
    nameCooperationAgree: string;
    nameCooperationAgree2: string;
    position: string;
    position2: string;
    nameOfFinance: string;
    emailOfFinance: string;
    bankName: string;
    accountNo: string;
    accountName: string;
}

const initialMerchantForm: MerchantForm = {
    // Merchant Data
    merchantName: '',
    nib: '',
    merchantEmail: '',
    password: '',
    websiteMerchant: '',
    paymentNotifyUrl: '',
    secretKey: '',
    clientId: '',
    urlAccessTokenB2B: '',
    urlPaymentDirectSuccess: '',
    urlPaymentDirectFailed: '',
    publicKey: '',
    channelID: '',
    effectiveDate: {
        startDate: null,
        endDate: null
    },
    fee: '',
    merchantAddress: '',
    province: null,
    city: null,
    district: null,
    village: null,
    postalCode: '',
    phoneNumber: '',

    // Settlement Information
    nameCooperationAgree: '',
    nameCooperationAgree2: '',
    position: '',
    position2: '',
    nameOfFinance: '',
    emailOfFinance: '',
    bankName: '',
    accountNo: '',
    accountName: '',
};

type UseMerchantBindingUpsertProps = {
    setSelectEdit: Dispatch<SetStateAction<MerchantDataList | null>>;
    onHide: () => void;
    isUpdate: boolean;
    merchantDetail: MerchantDetail | null;
    fetchMerchantList: () => void;
    activeStep: number,
    merchantFor: { label: string; value: string; },
    setActiveStep: Dispatch<SetStateAction<number>>;
    handleComplete: (step: number) => void;
};

function useMerchantAccountBindingUpsert(props: UseMerchantBindingUpsertProps) {
    const { setSelectEdit, onHide, isUpdate, merchantDetail, fetchMerchantList, activeStep,
        handleComplete, merchantFor, setActiveStep } = props;

    const { baseUrl } = useBaseUrl();
    const { enqueueSnackbar } = useSnackbar();
    const { getConfirmation } = useConfirmationDialog();
    const { t: tCommon } = useTranslation('common');

    const [isLoading, setIsLoading] = useState(false);
    const [provinceOptions, setProvinceOptions] = useState<OptionMap<string>[]>([]);
    const [cityOptions, setCityOptions] = useState<OptionMap<string>[]>([]);
    const [districtOptions, setDistrictOptions] = useState<OptionMap<string>[]>([]);
    const [villageOptions, setVillageOptions] = useState<OptionMap<string>[]>([]);
    const [qrTypeOptions, setQRTypeOptions] = useState<OptionMap<string>[]>([]);
    const [doubleAuthorize, setDoubleAuthorize] = useState<boolean>(false);
    const [merchantTypeOptions, setMerchantTypeOptions] = useState<OptionMap<string>[]>([]);
    const [merchantCriteriaOptions, setMerchantCriteriaOptions] = useState<OptionMap<string>[]>([]);
    const [merchantCategoryOptions, setMerchantCategoryOptions] = useState<OptionMap<string>[]>([]);
    const [merchantLocationOptions, setMerchantLocationOptions] = useState<OptionMap<string>[]>([]);

    const formData = useForm<MerchantForm>({
        defaultValues: initialMerchantForm,
    });
    const { handleSubmit, reset, setValue, getValues } = formData;

    const statusOptions: OptionMap<BankStatus>[] = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
    ];

    const fetchProvinceList = async (id: string, updateReload?: boolean) => {
        const { result, error } = await useProvinceListFetcher(baseUrl, {
            'country-id': id,
            page: 0,
            limit: 1000,
        });
        if (result && !error) {
            const listProvince = result.data.map(data => ({
                label: data.name,
                value: data.id,
            }));
            setProvinceOptions(listProvince);
            if (updateReload && merchantDetail) {
                const selectProvince = listProvince.find(
                    el => el.label === getValues('province.label'),
                );
                if (selectProvince) {
                    fetchCityList(selectProvince.value, true);
                    setValue('province', selectProvince);
                }
            }
        }
    };
    const fetchCityList = async (id: string, updateReload?: boolean) => {
        const { result, error } = await useCityListFetcher(baseUrl, {
            'province-id': id,
            page: 0,
            limit: 1000,
        });
        if (result && !error) {
            const listCity = result.data.map(data => ({
                label: data.name,
                value: data.id,
            }));
            setCityOptions(listCity);
            if (updateReload && merchantDetail) {
                const selectCity = listCity.find(
                    el => el.label === getValues('city.label'),
                );
                if (selectCity) {
                    fetchDistrictList(selectCity.value, true);
                    setValue('city', selectCity);
                }
            }
        }
    };

    const fetchDistrictList = async (id: string, updateReload?: boolean) => {
        const { result, error } = await useKecamatanListFetcher(baseUrl, {
            'city-id': id,
            page: 0,
            limit: 1000,
        });
        if (result && !error) {
            const listDistrict = result.data.map(data => ({
                label: data.name,
                value: data.id,
            }));
            setDistrictOptions(listDistrict);
            if (updateReload && merchantDetail) {
                const selectDistrict = listDistrict.find(
                    el => el.label === getValues('district.label'),
                );
                if (selectDistrict) {
                    fetchVillageList(selectDistrict.value, true);
                    setValue('district', selectDistrict);
                }
            }
        }
    };

    const fetchVillageList = async (id: string, updateReload?: boolean) => {
        const { result, error } = await useKelurahanListFetcher(baseUrl, {
            'kecamatan-id': id,
            page: 0,
            limit: 1000,
        });

        if (result && !error) {
            const listVillage = result.data.map(data => ({
                label: data.name,
                value: data.id,
            }));
            setVillageOptions(listVillage);
            if (updateReload && merchantDetail) {
                const selectDistrict = listVillage.find(
                    el => el.label === getValues('village.label'),
                );
                if (selectDistrict) {
                    setValue('village', selectDistrict);
                }
            }
        }
    };

    const fetchMerchantQRType = async () => {
        const { result, error } = await useMerchantQRTypeListFetcher(baseUrl);
        if (result && !error) {
            setQRTypeOptions(result.qrType.map(data => ({
                label: data,
                value: data,
            })));
        }
    };

    const fetchMerchantTypeList = async () => {
        const { result, error } = await useMerchantTypeListFetcher(baseUrl);

        if (result && !error) {
            setMerchantTypeOptions(result.map(data => ({
                label: data.type,
                value: data.id,
            })));
        }
    };

    const fetchMerchantCriteriaList = async () => {
        const { result, error } = await useMerchantCategoryListFetcher(baseUrl);

        if (result && !error) {
            setMerchantCriteriaOptions(result.map(data => ({
                label: data.code !== '' ? `${data.definition} (${data.code})` : `${data.definition}`,
                value: data.id,
            })));
        }
    };

    const fetchMerchantCategoryList = async () => {
        const payloadMerchantCategory: MerchantCategoryCodeRequest = {
            description: '',
            pageNumber: 0,
            pageSize: 100,
        };
        const { result, error } = await useMerchantCategoryCodeListFetcher(baseUrl, payloadMerchantCategory);

        if (result && !error) {
            setMerchantCategoryOptions(result.mccList.map(data => ({
                label: data.description,
                value: data.id,
                mcc: data.mcc,
            })));
        }
    };

    const fetchMerchantLocationList = async () => {
        const { result, error } = await useMerchantLocationListFetcher(baseUrl);

        if (result && !error) {
            setMerchantLocationOptions(result.merchantLocationList.map(data => ({
                label: data.name,
                value: data.id,
            })));
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setSelectEdit(null);
            reset();
            onHide();
            setActiveStep(0);
        }
    };

    const handleCancel = async () => {
        const confirmed = await getConfirmation({
            title: tCommon('confirmationCancelTitle', { text: 'Merchant' }),
            message: tCommon('confirmationCancelDescription'),
            primaryText: tCommon('confirmationCancelYes'),
            secondaryText: tCommon('confirmationCancelNo'),
            btnPrimaryColor: 'inherit',
            btnSecondaryColor: 'error',
        });
        if (confirmed) {
            handleClose();
        }
    };

    const handleSave = handleSubmit(async form => {
        if (activeStep < 1) {
            handleComplete(activeStep + 1);
            setActiveStep(activeStep + 1);
        } else {
            const confirmed = await getConfirmation({
                title: `${isUpdate
                    ? tCommon('confirmationUpdateTitle', { text: 'Merchant' })
                    : tCommon('confirmationCreateTitle', { text: 'Merchant' })
                    }`,
                message: `${isUpdate
                    ? tCommon('confirmationUpdateDescription', { text: 'Merchant' })
                    : tCommon('confirmationCreateDescription', { text: 'Merchant' })
                    }`,
                primaryText: `${isUpdate
                    ? tCommon('confirmationUpdateYes')
                    : tCommon('confirmationCreateYes')
                    }`,
                secondaryText: 'Cancel',
            });

            // const onlyPhone = form.phoneNumber.startsWith('+62') ? form.phoneNumber.slice(3) : form.phoneNumber;
            // const countryCode = form.phoneNumber.startsWith('+62') ? '+62' : '';
            const onlyPhone = form.phoneNumber.split(' ').slice(1).join('');
            const countryCode = form.phoneNumber.match(/^\+(\d+)/)?.[0];

            const payloadCreate: MerchantCreateQRISAcquirerRequest = {
                // Merchant Data
                merchantFunction: merchantFor.value,
                merchantCompleteName: form.merchantName,
                nikOrNib: form.nib,
                email: form.merchantEmail,
                password: form.password,
                website: form.websiteMerchant,
                paymentNotifUrl: form.paymentNotifyUrl,
                secretKey: form.secretKey,
                clientId: form.clientId,
                authTokenUrl: form.urlAccessTokenB2B,
                urlPaymentDirectSuccess: form.urlPaymentDirectSuccess,
                urlPaymentDirectFailed: form.urlPaymentDirectFailed,
                publicKey: form.publicKey,
                channelId: form.channelID,
                effectiveDateFrom: stringToDateFormat(form.effectiveDate.startDate),
                effectiveDateTo: stringToDateFormat(form.effectiveDate.endDate),
                fee: form.fee,
                address: form.merchantAddress,
                addressProvince: TextGetter.getterString(form.province?.label),
                addressCity: TextGetter.getterString(form.city?.label),
                addressDistrict: TextGetter.getterString(form.district?.label),
                addressVillage: TextGetter.getterString(form.village?.label),
                postalCode: form.postalCode,
                phoneNumber: onlyPhone,
                countryCode: countryCode,

                // Settlement Information
                cooperationAgreementList: doubleAuthorize ? [{
                    jabatan: form.position,
                    name: form.nameCooperationAgree
                }, {
                    jabatan: form.position2,
                    name: form.nameCooperationAgree2
                }] : [{
                    jabatan: form.position,
                    name: form.nameCooperationAgree
                }],
                settlementPicName: form.nameOfFinance,
                settlementPicEmail: form.emailOfFinance,
                bankName: form.bankName,
                accountName: form.accountName,
                accountNumber: form.accountNo,
                terminalId: 1,

                active: true,
            };

            const payloadUpdate: MerchantUpdateQRISAcquirerRequest = {
                // Merchant Data
                merchantFunction: merchantFor.value,
                merchantCompleteName: form.merchantName,
                nikOrNib: form.nib,
                email: form.merchantEmail,
                password: form.password,
                website: form.websiteMerchant,
                paymentNotifUrl: form.paymentNotifyUrl,
                secretKey: form.secretKey,
                clientId: form.clientId,
                authTokenUrl: form.urlAccessTokenB2B,
                urlPaymentDirectSuccess: form.urlPaymentDirectSuccess,
                urlPaymentDirectFailed: form.urlPaymentDirectFailed,
                publicKey: form.publicKey,
                channelId: form.channelID,
                effectiveDateFrom: stringToDateFormat(form.effectiveDate.startDate),
                effectiveDateTo: stringToDateFormat(form.effectiveDate.endDate),
                fee: form.fee,
                address: form.merchantAddress,
                addressProvince: TextGetter.getterString(form.province?.label),
                addressCity: TextGetter.getterString(form.city?.label),
                addressDistrict: TextGetter.getterString(form.district?.label),
                addressVillage: TextGetter.getterString(form.village?.label),
                postalCode: form.postalCode,
                phoneNumber: onlyPhone,
                countryCode: countryCode,

                // Settlement Information
                cooperationAgreementList: doubleAuthorize ? [{
                    jabatan: form.position,
                    name: form.nameCooperationAgree
                }, {
                    jabatan: form.position2,
                    name: form.nameCooperationAgree2
                }] : [{
                    jabatan: form.position,
                    name: form.nameCooperationAgree
                }],
                settlementPicName: form.nameOfFinance,
                settlementPicEmail: form.emailOfFinance,
                bankName: form.bankName,
                accountName: form.accountName,
                accountNumber: form.accountNo,
                terminalId: 1,

                active: true,
            };
            if (confirmed) {
                setIsLoading(true);
                const { error, errorData } = !isUpdate
                    ? await userMerchantCreateQRISAcquirerFetcher(baseUrl, payloadCreate)
                    : await useMerchantUpdateQRISAcquirerFetcher(
                        baseUrl,
                        merchantDetail?.id || '',
                        payloadUpdate,
                    );
                setIsLoading(false);
                if (!error) {
                    enqueueSnackbar(
                        `${isUpdate
                            ? tCommon('successUpdate', { text: 'Merchant' })
                            : tCommon('successAdd', { text: 'Merchant' })
                        }`,
                        { variant: 'success' },
                    );
                    handleClose();
                    fetchMerchantList();
                    reset();
                    setActiveStep(0);
                } else {
                    enqueueSnackbar(
                        errorData?.status?.text ||
                        `${isUpdate
                            ? errorData?.status?.text
                            : tCommon('failedCreate', {
                                text: 'Merchant',
                            })
                        }`,
                        { variant: 'error' },
                    );
                }
            }
        }
    });

    useEffect(() => {
        fetchProvinceList('c727a474-0ffc-4497-9b2c-6c7f291895bc');
        fetchMerchantQRType();
        fetchMerchantTypeList();
        fetchMerchantCriteriaList();
        fetchMerchantCategoryList();
        fetchMerchantLocationList();
    }, []);

    useEffect(() => {
        if (isUpdate && merchantDetail) {
            // Merchant Data
            setValue('merchantName', merchantDetail.merchantCompleteName);
            setValue('nib', merchantDetail.nikOrNib);
            setValue('merchantEmail', merchantDetail.email);
            setValue('websiteMerchant', merchantDetail.webSite);
            setValue('paymentNotifyUrl', merchantDetail.paymentNotificationUrl);
            setValue('secretKey', merchantDetail.secretKey);
            setValue('clientId', merchantDetail.clientId);
            setValue('urlAccessTokenB2B', merchantDetail.authTokenRequestUrl);
            setValue(
                'urlPaymentDirectSuccess',
                merchantDetail.urlPaymentDirectSuccess,
            );
            setValue('urlPaymentDirectFailed', merchantDetail.urlPaymentDirectFailed);
            setValue('publicKey', merchantDetail.publicKey);
            setValue('channelID', merchantDetail.channelId);
            setValue('effectiveDate', {
                startDate: new Date(merchantDetail.effectiveDateFrom),
                endDate: new Date(merchantDetail.effectiveDateTo),
            });
            setValue('fee', merchantDetail.fee);
            setValue('merchantAddress', merchantDetail.address);
            setValue(
                'phoneNumber',
                `${merchantDetail.countryCode.slice(0, 1) === '+'
                    ? merchantDetail.countryCode
                    : `+${merchantDetail.countryCode}`
                } ${merchantDetail.phoneNumber.slice(
                    0,
                    3,
                )} ${merchantDetail.phoneNumber.slice(
                    3,
                    7,
                )} ${merchantDetail.phoneNumber.slice(7)}`,
            );
            setValue('postalCode', merchantDetail.postalCode);
            setValue('province.label', merchantDetail.addressProvince);
            setValue('city.label', merchantDetail.addressCity);
            setValue('district.label', merchantDetail.addressDistrict);
            setValue('village.label', merchantDetail.addressVillage);

            // Settlement Information
            setValue(
                'nameCooperationAgree',
                merchantDetail.cooperationAgreementList[0].name,
            );
            setValue('position', merchantDetail.cooperationAgreementList[0].position);
            setValue('nameOfFinance', merchantDetail.picNameOfFinance);
            setValue('emailOfFinance', merchantDetail.picEmailOfFinance);
            setValue('bankName', merchantDetail.bankName);
            setValue('accountNo', merchantDetail.accountNumber);
            setValue('accountName', merchantDetail.accountName);
            if (merchantDetail.cooperationAgreementList.length > 1) {
                setDoubleAuthorize(true);
                setValue(
                    'nameCooperationAgree2',
                    merchantDetail.cooperationAgreementList[1].name,
                );
                setValue(
                    'position2',
                    merchantDetail.cooperationAgreementList[1].position,
                );
            }
        }
    }, [merchantDetail]);

    return {
        formData,
        isLoading,
        statusOptions,
        handleCancel,
        handleClose,
        handleSave,
        provinceOptions,
        setProvinceOptions,
        cityOptions,
        setCityOptions,
        fetchCityList,
        qrTypeOptions,
        merchantTypeOptions,
        merchantCriteriaOptions,
        merchantCategoryOptions,
        merchantLocationOptions,
        fetchDistrictList,
        fetchVillageList,
        districtOptions,
        villageOptions,
        doubleAuthorize,
        setDoubleAuthorize,
        fetchProvinceList
    };
}

export default useMerchantAccountBindingUpsert;