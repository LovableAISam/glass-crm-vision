// Cores
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Hooks & Utils
import { useSnackbar } from "notistack";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useConfirmationDialog } from "@woi/web-component";
import { useTranslation } from "react-i18next";
import useBaseUrlPrincipal from "@src/shared/hooks/useBaseUrlPrincipal";

// Types & Consts
import { OptionMap } from "@woi/option";
import { PasswordGenerator, TextGetter } from "@woi/core";
import { DatePeriod } from "@woi/core/utils/date/types";
import { UploadDocumentData } from "@woi/uploadDocument";
import { BankStatus } from "@woi/service/principal/admin/bank/bankList";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useMerchantCategoryCodeListFetcher, useMerchantCategoryListFetcher, useMerchantTypeListFetcher, useMerchantUpdateFetcher, userMerchantCreateFetcher } from "@woi/service/co";
import { MerchantDataList } from "@woi/service/co/merchant/merchantList";
import { MerchantDetail } from "@woi/service/co/merchant/merchantDetail";
import { MerchantCreateRequest } from "@woi/service/co/merchant/merchantCreate";
import { MerchantUpdateRequest } from "@woi/service/co/merchant/merchantpdate";

export interface MerchantForm {
    merchantName: string;
    merchantCode: string;
    phoneNumber: string;
    username: string;
    email: string;
    effectiveDate: DatePeriod;
    password: string;
    passwordConfirm: string;
    status: OptionMap<BankStatus> | null;
    logo: UploadDocumentData | null;
    fieldDate: string;
    merchantType: OptionMap<string> | null;
    merchantCategory: OptionMap<string> | null;
    merchantCategoryCode: OptionMap<string> | null;
}

const initialMerchantForm: MerchantForm = {
    merchantName: '',
    merchantCode: '',
    phoneNumber: '',
    username: '',
    email: '',
    effectiveDate: {
        startDate: null,
        endDate: null,
    },
    password: '',
    passwordConfirm: '',
    status: null,
    logo: null,
    fieldDate: '',
    merchantType: null,
    merchantCategory: null,
    merchantCategoryCode: null,
};

export interface ImageState {
    selectedFile: UploadDocumentData | null;
    selectedImage: string | null;
}

type UseMerchantUpsertProps = {
    setSelectEdit: Dispatch<SetStateAction<MerchantDataList | null>>;
    onHide: () => void;
    isUpdate: boolean;
    merchantDetail: MerchantDetail | null;
    fetchMerchantList: () => void;
};

function useMerchantPartnerUpsert(props: UseMerchantUpsertProps) {
    const { setSelectEdit, onHide, isUpdate, merchantDetail, fetchMerchantList } = props;

    const { baseUrl } = useBaseUrl();
    const { baseUrlPrincipal } = useBaseUrlPrincipal();
    const { enqueueSnackbar } = useSnackbar();
    const { getConfirmation } = useConfirmationDialog();
    const { t: tCommon } = useTranslation('common');

    const statusOptions: OptionMap<BankStatus>[] = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
    ];

    const formData = useForm<MerchantForm>({
        defaultValues: initialMerchantForm,
    });
    const { setValue, clearErrors, handleSubmit, reset } = formData;

    const [isLoading, setIsLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<ImageState | null>(null);
    const [merchantTypeOptions, setMerchantTypeOptions] = useState<OptionMap<string>[]>([{ label: '', value: '' }]);
    const [merchantCategoryOptions, setMerchantCategoryOptions] = useState<OptionMap<string>[]>([{ label: '', value: '' }]);
    const [merchantCategoryCodeOptions, setMerchantCategoryCodeOptions] = useState<OptionMap<string>[]>([{ label: '', value: '' }]);

    const fetchMerchantType = async () => {
        const { result, error } = await useMerchantTypeListFetcher(baseUrlPrincipal);

        if (result && !error) {
            setMerchantTypeOptions(result.map(data => ({
                label: data.type,
                value: data.id,
            })));
        }
    };

    const fetchMerchantCategory = async () => {
        const { result, error } = await useMerchantCategoryListFetcher(baseUrlPrincipal);

        if (result && !error) {
            setMerchantCategoryOptions(result.map(data => ({
                label: data.definition,
                value: data.id,
                code: data.code,
            })));
        }
    };

    const fetchMerchantCategoryCode = async () => {
        const { result, error } = await useMerchantCategoryCodeListFetcher(baseUrlPrincipal, {
            pageNumber: 0,
            pageSize: 1000,
            description: '',
        });

        if (result && !error) {
            setMerchantCategoryCodeOptions(result.mccList.map(data => ({
                label: data.description,
                value: data.id,
                mcc: data.mcc,
            })));
        }
    };

    const handleGeneratePassword = () => {
        const password = PasswordGenerator.getPasswordGenerator();
        setValue('password', password);
        setValue('passwordConfirm', password);
        clearErrors(['password', 'passwordConfirm']);
    };

    const onUpload = (file: UploadDocumentData | null) => {
        setImageUpload({ selectedImage: (imageUpload?.selectedImage || null), selectedFile: file });
    };

    const onChangeImage = (file: string | null) => {
        setImageUpload({ selectedImage: file, selectedFile: (imageUpload?.selectedFile || null) });
    };

    const handleClose = () => {
        if (!isLoading) {
            setSelectEdit(null);
            setImageUpload(null);
            reset();
            onHide();
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
        let phone;
        if (form.phoneNumber.split(' ').length === 1) {
            phone = form.phoneNumber.slice(3);
        } else if (onlyPhone.slice(0, 1) === '0') {
            phone = onlyPhone.slice(1);
        } else {
            phone = onlyPhone;
        }

        const countryCode = form.phoneNumber.match(/^\+(\d+)/);

        const payload = {
            effectiveDateFrom: stringToDateFormat(form.effectiveDate.startDate),
            effectiveDateTo: stringToDateFormat(form.effectiveDate.endDate),
            merchantName: form.merchantName,
            phoneNumber: phone,
            merchantType: TextGetter.getterString(form.merchantType?.value),
            merchantCodeCategory: TextGetter.getterString(form.merchantCategoryCode?.value),
            countryCode: countryCode ? countryCode[1] : '',
        };

        const payloadCreate: MerchantCreateRequest = {
            ...payload,
            merchantCategory: TextGetter.getterString(form.merchantCategory?.value),
            email: form.email,
            password: form.password,
            photoLogo: imageUpload?.selectedFile?.docPath || '',
            active: true,
        };
        const payloadUpdate: MerchantUpdateRequest = {
            ...payload,
            merchantCriteria: TextGetter.getterString(form.merchantCategory?.value),
            photoLogo:
                imageUpload?.selectedImage !== null
                    ? imageUpload?.selectedFile?.docPath || ''
                    : '',
            status: (form?.status?.label || form?.status) === 'Active',
            principalId: ""
        };
        if (confirmed) {
            setIsLoading(true);
            const { error, errorData } = !isUpdate
                ? await userMerchantCreateFetcher(baseUrl, payloadCreate)
                : await useMerchantUpdateFetcher(
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
            } else {
                enqueueSnackbar(
                    errorData?.details?.[0] ||
                    `${isUpdate
                        ? tCommon('failedUpdate', {
                            text: 'Merchant',
                        })
                        : tCommon('failedCreate', {
                            text: 'Merchant',
                        })
                    }`,
                    { variant: 'error' },
                );
            }
        }
    });

    useEffect(() => {
        fetchMerchantType();
        fetchMerchantCategory();
        fetchMerchantCategoryCode();
    }, []);


    return {
        formData,
        isLoading,
        imageUpload,
        statusOptions,
        onUpload,
        onChangeImage,
        handleGeneratePassword,
        handleCancel,
        handleClose,
        handleSave,
        merchantTypeOptions,
        merchantCategoryOptions,
        merchantCategoryCodeOptions,
        setImageUpload
    };
}

export default useMerchantPartnerUpsert;