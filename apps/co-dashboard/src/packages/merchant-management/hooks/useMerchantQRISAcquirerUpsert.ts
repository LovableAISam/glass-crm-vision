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
    merchantType: string;
    merchantBrand: string;
    identityNo: string;
    identityNumber: string;
    expiredDate: Date | null;
    dateOfBirth: Date | null;
    address: string;
    province: OptionMap<string> | null;
    city: OptionMap<string> | null;
    district: OptionMap<string> | null;
    village: OptionMap<string> | null;
    phoneNumber: string;
    postCode: string;

    // Merchant Data 2
    merchantCompleteName: string;
    merchantShortName: string;
    password: string;
    isQrisTag51: boolean;
    qrType: OptionMap<string> | null;
    merchantType2: OptionMap<string> | null;
    merchantCriteria: OptionMap<string> | null;
    merchantCategoryCode: OptionMap<string> | null;
    grossRevenue: string;
    comparisonOfTransactionFrom: string;
    comparisonOfTransactionTo: string;
    merchantEmail: string;
    nikOrNIB: string;
    dateOfMerchantRelease: Date | null;
    mdrPercentage: string;
    nmid: string;
    authTokenUrl: string;
    paymentNotifyUrl: string;
    secretKey: string;
    clientId: string;
    publicKey: string;
    merchantAddressCorrespondence: string;
    province2: OptionMap<string> | null;
    city2: OptionMap<string> | null;
    district2: OptionMap<string> | null;
    village2: OptionMap<string> | null;
    postCode2: string;
    merchantLocation: OptionMap<string> | null;
    anotherMerchantLocation: string;
    npwp: string;
    tipsType: string;
    tipsTypePercentage: string;
    socialmedia: string;
    website: string;
    terminalId: string;
    effectiveDate: DatePeriod;

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
    merchantType: 'individual',
    merchantBrand: '',
    identityNumber: '',
    identityNo: 'identityCard',
    expiredDate: null,
    dateOfBirth: null,
    address: '',
    province: null,
    city: null,
    district: null,
    village: null,
    phoneNumber: '',
    postCode: '',
    isQrisTag51: false,

    // Merchant Data 2
    merchantCompleteName: '',
    merchantShortName: '',
    password: '',
    qrType: null,
    merchantType2: null,
    merchantCriteria: null,
    merchantCategoryCode: null,
    grossRevenue: '',
    comparisonOfTransactionFrom: '',
    comparisonOfTransactionTo: '',
    merchantEmail: '',
    nikOrNIB: '',
    dateOfMerchantRelease: null,
    mdrPercentage: '',
    nmid: '',
    authTokenUrl: '',
    paymentNotifyUrl: '',
    secretKey: '',
    clientId: '',
    publicKey: '',
    merchantAddressCorrespondence: '',
    province2: null,
    city2: null,
    district2: null,
    village2: null,
    postCode2: '',
    merchantLocation: null,
    anotherMerchantLocation: '',
    npwp: '',
    tipsType: '',
    tipsTypePercentage: '',
    socialmedia: '',
    website: '',
    terminalId: '',
    effectiveDate: {
        startDate: null,
        endDate: null
    },

    // Settlement Information
    nameCooperationAgree: '',
    nameCooperationAgree2: '',
    position: '',
    position2: '',
    nameOfFinance: '',
    emailOfFinance: '',
    bankName: '',
    accountNo: '',
    accountName: ''
};

type UseMerchantUpsertProps = {
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

function useMerchantQRISAcquirerUpsert(props: UseMerchantUpsertProps) {
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
                const responseProvince = activeStep === 0 ? getValues('province.label') : getValues('province2.label');
                const selectProvince = listProvince.find(
                    el => el.label === responseProvince,
                );
                if (selectProvince) {
                    fetchCityList(selectProvince.value, true);
                    setValue(`${activeStep === 0 ? 'province' : 'province2'}`, selectProvince);
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
                const responseCity = activeStep === 0 ? getValues('city.label') : getValues('city2.label');
                const selectCity = listCity.find(
                    el => el.label === responseCity,
                );
                if (selectCity) {
                    fetchDistrictList(selectCity.value, true);
                    setValue(`${activeStep === 0 ? 'city' : 'city2'}`, selectCity);
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
                const responseDistrict = activeStep === 0 ? getValues('district.label') : getValues('district2.label');
                const selectDistrict = listDistrict.find(
                    el => el.label === responseDistrict,
                );
                if (selectDistrict) {
                    fetchVillageList(selectDistrict.value, true);
                    setValue(`${activeStep === 0 ? 'district' : 'district2'}`, selectDistrict);
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
                const responseVillage = activeStep === 0 ? getValues('village.label') : getValues('village2.label');
                const selectDistrict = listVillage.find(
                    el => el.label === responseVillage,
                );
                if (selectDistrict) {
                    setValue(`${activeStep === 0 ? 'village' : 'village2'}`, selectDistrict);
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
        if (activeStep < 2) {
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

            const onlyPhone = form.phoneNumber.split(' ').slice(1).join('');
            const countryCode = form.phoneNumber.match(/^\+(\d+)/)?.[0];

            const payloadCreate: MerchantCreateQRISAcquirerRequest = {
                // Merchant Data
                // merchantFunction: merchantFor.value,
                isIndividualBusiness: form.merchantType === 'individual',
                merchantBrand: form.merchantBrand,
                idType: form.identityNo,
                passportExpiryDate: stringToDateFormat(form.expiredDate),
                idNumber: form.identityNumber?.toString() || '',
                dateOfBirth: stringToDateFormat(form.dateOfBirth),
                address: form.address,
                addressProvince: TextGetter.getterString(form.province?.label),
                addressCity: TextGetter.getterString(form.city?.label),
                // addressDistrict: TextGetter.getterString(form.district?.label),
                // addressVillage: TextGetter.getterString(form.village?.label),
                phoneNumber: onlyPhone,
                countryCode: countryCode,
                postalCode: form.postCode,

                // Merchant Data 2
                merchantCompleteName: form.merchantCompleteName,
                merchantShortName: form.merchantShortName,
                password: form.password,
                isQrisTag51: form.isQrisTag51,
                qrType: TextGetter.getterString(form.qrType?.value),
                merchantCategory: TextGetter.getterString(form.merchantCriteria?.value),
                merchantType: TextGetter.getterString(form.merchantType2?.value),
                merchantCodeCategory: TextGetter.getterString(form.merchantCategoryCode?.value),
                grossRevenue: form.grossRevenue || '',
                comparisonTransactionFrom: form.comparisonOfTransactionFrom,
                comparisonTransactionTo: form.comparisonOfTransactionTo,
                email: form.merchantEmail,
                nikOrNib: form.nikOrNIB,
                merchantReleaseDate: stringToDateFormat(form.dateOfMerchantRelease),
                mdrPercentage: form.mdrPercentage,
                nmid: form.nmid,
                authTokenUrl: form.authTokenUrl,
                paymentNotifUrl: form.paymentNotifyUrl,
                secretKey: form.secretKey,
                clientId: form.clientId,
                publicKey: form.publicKey,
                merchantAddressCorrespondence: form.merchantAddressCorrespondence,
                merchantAddressCorrespondenceProvince: TextGetter.getterString(form.province2?.label),
                merchantAddressCorrespondenceCity: TextGetter.getterString(form.city2?.label),
                // merchantAddressCorrespondenceDistrict: TextGetter.getterString(form.district2?.label),
                // merchantAddressCorrespondenceVillage: TextGetter.getterString(form.village2?.label),
                merchantAddressCorrespondencePostalCode: form.postCode2,
                merchantLocation: TextGetter.getterString(form.merchantLocation?.value),
                merchantOtherLocation: form.anotherMerchantLocation,
                npwp: form.npwp,
                tipsType: form.tipsType,
                tipsAmount: form.tipsType === 'FIXED' ? form.tipsTypePercentage : '',
                tipsPercentage: form.tipsType === 'PERCENTAGE' ? form.tipsTypePercentage : '',
                socialMedia: form.socialmedia,
                website: form.website,
                effectiveDateFrom: stringToDateFormat(form.effectiveDate.startDate),
                effectiveDateTo: stringToDateFormat(form.effectiveDate.endDate),

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
                photoLogo: '',
            };

            const payloadUpdate: MerchantUpdateQRISAcquirerRequest = {
                // Merchant Data
                merchantFunction: merchantFor.value,
                isIndividualBusiness: form.merchantType === 'individual',
                merchantBrand: form.merchantBrand,
                idType: form.identityNo,
                passportExpiryDate: stringToDateFormat(form.expiredDate),
                idNumber: form.identityNumber?.toString() || '',
                dateOfBirth: stringToDateFormat(form.dateOfBirth),
                address: form.address,
                addressProvince: TextGetter.getterString(form.province?.label),
                addressCity: TextGetter.getterString(form.city?.label),
                addressDistrict: TextGetter.getterString(form.district?.label),
                addressVillage: TextGetter.getterString(form.village?.label),
                phoneNumber: onlyPhone,
                countryCode: countryCode,
                postalCode: form.postCode,

                // Merchant Data 2
                merchantCompleteName: form.merchantCompleteName,
                merchantShortName: form.merchantShortName,
                password: form.password,
                isQrisTag51: form.isQrisTag51,
                qrType: TextGetter.getterString(form.qrType?.value),
                merchantCategory: TextGetter.getterString(form.merchantCriteria?.value),
                merchantType: TextGetter.getterString(form.merchantType2?.value),
                merchantCodeCategory: TextGetter.getterString(form.merchantCategoryCode?.value),
                grossRevenue: form.grossRevenue || '',
                comparisonTransactionFrom: form.comparisonOfTransactionFrom,
                comparisonTransactionTo: form.comparisonOfTransactionTo,
                email: form.merchantEmail,
                nikOrNib: form.nikOrNIB,
                merchantReleaseDate: stringToDateFormat(form.dateOfMerchantRelease),
                mdrPercentage: form.mdrPercentage,
                nmid: form.nmid,
                authTokenUrl: form.authTokenUrl,
                paymentNotifUrl: form.paymentNotifyUrl,
                secretKey: form.secretKey,
                clientId: form.clientId,
                publicKey: form.publicKey,
                merchantAddressCorrespondence: form.merchantAddressCorrespondence,
                merchantAddressCorrespondenceProvince: TextGetter.getterString(form.province2?.label),
                merchantAddressCorrespondenceCity: TextGetter.getterString(form.city2?.label),
                merchantAddressCorrespondenceDistrict: TextGetter.getterString(form.district2?.label),
                merchantAddressCorrespondenceVillage: TextGetter.getterString(form.village2?.label),
                merchantAddressCorrespondencePostalCode: form.postCode2,
                merchantLocation: TextGetter.getterString(form.merchantLocation?.value),
                merchantOtherLocation: form.anotherMerchantLocation,
                npwp: form.npwp,
                tipsType: form.tipsType,
                tipsAmount: form.tipsType === 'FIXED' ? form.tipsTypePercentage : '',
                tipsPercentage: form.tipsType === 'PERCENTAGE' ? form.tipsTypePercentage : '',
                socialMedia: form.socialmedia,
                website: form.website,
                effectiveDateFrom: stringToDateFormat(form.effectiveDate.startDate),
                effectiveDateTo: stringToDateFormat(form.effectiveDate.endDate),

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
                photoLogo: '',

                merchantCode: '',
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
                    setActiveStep(0);
                    reset();
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
            setValue('merchantType', merchantDetail.isIndividualBusiness);
            setValue('merchantBrand', merchantDetail.merchantBrand);
            setValue('identityNo', merchantDetail.identityType);
            setValue('identityNumber', merchantDetail.identityNumber);
            setValue('expiredDate', new Date(merchantDetail.passportExpiryDate));
            setValue('dateOfBirth', new Date(merchantDetail.birthDate));
            setValue('address', merchantDetail.address);
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
            setValue('postCode', merchantDetail.postalCode);
            setValue('province.label', merchantDetail.addressProvince);
            setValue('city.label', merchantDetail.addressCity);
            setValue('district.label', merchantDetail.addressDistrict);
            setValue('village.label', merchantDetail.addressVillage);

            // Merchant Data 2
            setValue('merchantCompleteName', merchantDetail.merchantCompleteName);
            setValue('merchantShortName', merchantDetail.merchantShortName);
            setValue('isQrisTag51', merchantDetail.isTag51Only);
            setValue('qrType', {
                label: merchantDetail.qrType,
                value: merchantDetail.qrType,
            });
            setValue('grossRevenue', merchantDetail?.grossRevenue?.toString());
            setValue(
                'comparisonOfTransactionFrom',
                merchantDetail?.comparisonOfTransactionFrom?.toString(),
            );
            setValue(
                'comparisonOfTransactionTo',
                merchantDetail?.comparisonOfTransactionTo?.toString(),
            );
            setValue('merchantEmail', merchantDetail.email);
            setValue('nikOrNIB', merchantDetail.nikOrNib);
            setValue(
                'dateOfMerchantRelease',
                new Date(merchantDetail.merchantReleaseDate),
            );
            setValue('mdrPercentage', merchantDetail?.mdrPercentage?.toString());
            setValue('nmid', merchantDetail.nmId);
            setValue('authTokenUrl', merchantDetail.authTokenRequestUrl);
            setValue('paymentNotifyUrl', merchantDetail.paymentNotificationUrl);
            setValue('secretKey', merchantDetail.secretKey);
            setValue('clientId', merchantDetail.clientId);
            setValue('publicKey', merchantDetail.publicKey);
            setValue('terminalId', merchantDetail.terminalId);
            setValue(
                'merchantAddressCorrespondence',
                merchantDetail.merchantAddressCorrespondence,
            );
            setValue('npwp', merchantDetail.npwp);
            setValue(
                'postCode2',
                merchantDetail.merchantAddressCorrespondencePostalCode,
            );
            setValue('anotherMerchantLocation', merchantDetail.merchantLocation);
            setValue('tipsType', merchantDetail.tipsType);
            setValue(
                'tipsTypePercentage',
                merchantDetail?.percentageTips?.toString(),
            );
            setValue('socialmedia', merchantDetail.socialMedia);
            setValue('website', merchantDetail.webSite);
            setValue('effectiveDate', {
                startDate: new Date(merchantDetail.effectiveDateFrom),
                endDate: new Date(merchantDetail.effectiveDateFrom),
            });
            setValue('province2.label', merchantDetail.merchantAddressCorrespondenceProvince);
            setValue('city2.label', merchantDetail.merchantAddressCorrespondenceCity);
            setValue('district2.label', merchantDetail.merchantAddressCorrespondenceDistrict);
            setValue('village2.label', merchantDetail.merchantAddressCorrespondenceVillage);

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
    }, []);

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

export default useMerchantQRISAcquirerUpsert;