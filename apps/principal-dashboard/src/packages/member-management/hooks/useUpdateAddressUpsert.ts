import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { TextGetter } from "@woi/core";
import { OptionMap } from "@woi/option";
import { useKYCUpdateAddressFetcher } from "@woi/service/co";
import { useCityListFetcher, useKecamatanListFetcher, useKelurahanListFetcher, useProvinceListFetcher } from "@woi/service/principal";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { KycPremiumMemberDetailHistoryForm } from "./useMemberUpsert";
import { MemberData } from "@woi/service/co/idp/member/memberList";

export interface MemberForm {
    country: OptionMap<string> | null;                  // negara
    countryDomicile: OptionMap<string> | null;
    province: OptionMap<string> | null;                 // provinsi
    provinceDomicile: OptionMap<string> | null;
    cityId: OptionMap<string> | null;                   // kabupaten / kota
    cityIdDomicile: OptionMap<string> | null;
    subDistrictId: OptionMap<string> | null;            // kecamatan
    subDistrictIdDomicile: OptionMap<string> | null;
    urbanVillageId: OptionMap<string> | null;           // kelurahan
    urbanVillageIdDomicile: OptionMap<string> | null;
    postalCode: string;                                 // kode pos
    postalCodeDomicile: string;
    address: string;                                    // alamat
    addressDomicile: string;
}

const countryValue = {
    label: "Indonesia",
    value: "c727a474-0ffc-4497-9b2c-6c7f291895bc"
};

const initialMemberForm: MemberForm = {
    address: '',
    addressDomicile: '',
    cityId: null,
    cityIdDomicile: null,
    postalCode: '',
    postalCodeDomicile: '',
    subDistrictId: null,
    subDistrictIdDomicile: null,
    urbanVillageId: null,
    urbanVillageIdDomicile: null,
    country: countryValue,
    countryDomicile: countryValue,
    province: null,
    provinceDomicile: null,
};

interface UserUpsertProps {
    onHide: () => void;
    memberKYCDetail: KycPremiumMemberDetailHistoryForm | null;
    selectedData: MemberData;
    fetchMemberKYCHistoryDetail: (id: string) => Promise<void>;
}

function useUpdateAddressUpsert(props: UserUpsertProps) {
    const { onHide, memberKYCDetail, selectedData, fetchMemberKYCHistoryDetail } = props;
    const { baseUrl } = useBaseUrl();
    const { enqueueSnackbar } = useSnackbar();
    const { t: tCommon } = useTranslation('common');
    const { getConfirmation } = useConfirmationDialog();

    const [loading, setLoading] = useState<boolean>(false);
    const [listProvinceIdentity, setListProvinceIdentity] = useState<OptionMap<string>[]>([]);
    const [listProvinceDomicile, setListProvinceDomicile] = useState<OptionMap<string>[]>([]);
    const [listSubDistrictIdentity, setListSubDistrictIdentity] = useState<OptionMap<string>[]>([]);
    const [listSubDistrictDomicile, setListSubDistrictDomicile] = useState<OptionMap<string>[]>([]);
    const [listUrbanVillageIdentity, setListUrbanVillageIdentity] = useState<OptionMap<string>[]>([]);
    const [listUrbanVillageDomicile, setListUrbanVillageDomicile] = useState<OptionMap<string>[]>([]);
    const [listCityIdentity, setListCityIdentity] = useState<OptionMap<string>[]>([]);
    const [listCityDomicile, setListCityDomicile] = useState<OptionMap<string>[]>([]);
    const [isAddressSame, setIsAddressSame] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAddressSame(event.target.checked);
    };

    const formData = useForm<MemberForm>({
        defaultValues: initialMemberForm,
    });
    const { handleSubmit, setValue } = formData;

    const fetchListProvinceIdentity = async (countryId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useProvinceListFetcher(baseUrl, { "country-id": countryId, limit: 100 });
        if (result && !error) {
            setListProvinceIdentity(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectProvince = result.data.find((e) => e.id === memberKYCDetail?.identityCard.provinceId);
                setValue('province', { label: TextGetter.getterString(selectProvince?.name), value: TextGetter.getterString(selectProvince?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListCityIdentity = async (provinceId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useCityListFetcher(baseUrl, { "province-id": provinceId, limit: 100 });
        if (result && !error) {
            setListCityIdentity(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectCity = result.data.find((e) => e.id === memberKYCDetail?.identityCard.cityId);
                setValue('cityId', { label: TextGetter.getterString(selectCity?.name), value: TextGetter.getterString(selectCity?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListSubDistrictIdentity = async (cityId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useKecamatanListFetcher(baseUrl, { "city-id": cityId, limit: 100 });
        if (result && !error) {
            setListSubDistrictIdentity(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectSubDistrict = result.data.find((e) => e.id === memberKYCDetail?.identityCard.kecamatanId);
                setValue('subDistrictId', { label: TextGetter.getterString(selectSubDistrict?.name), value: TextGetter.getterString(selectSubDistrict?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListUrbanVillageIdentity = async (subDistrictId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useKelurahanListFetcher(baseUrl, { "kecamatan-id": subDistrictId, limit: 100 });
        if (result && !error) {
            setListUrbanVillageIdentity(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectUrbanVillage = result.data.find((e) => e.id === memberKYCDetail?.identityCard.kelurahanId);
                setValue('urbanVillageId', { label: TextGetter.getterString(selectUrbanVillage?.name), value: TextGetter.getterString(selectUrbanVillage?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListProvinceDomicile = async (countryId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useProvinceListFetcher(baseUrl, { "country-id": countryId, limit: 100 });
        if (result && !error) {
            setListProvinceDomicile(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectProvince = result.data.find((e) => e.id === memberKYCDetail?.memberResidence.provinceId);
                setValue('provinceDomicile', { label: TextGetter.getterString(selectProvince?.name), value: TextGetter.getterString(selectProvince?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListCityDomicile = async (provinceId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useCityListFetcher(baseUrl, { "province-id": provinceId, limit: 100 });
        if (result && !error) {
            setListCityDomicile(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectCity = result.data.find((e) => e.id === memberKYCDetail?.memberResidence.cityId);
                setValue('cityIdDomicile', { label: TextGetter.getterString(selectCity?.name), value: TextGetter.getterString(selectCity?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListSubDistrictDomicile = async (cityId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useKecamatanListFetcher(baseUrl, { "city-id": cityId, limit: 100 });
        if (result && !error) {
            setListSubDistrictDomicile(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectSubDistrict = result.data.find((e) => e.id === memberKYCDetail?.memberResidence.kecamatanId);
                setValue('subDistrictIdDomicile', { label: TextGetter.getterString(selectSubDistrict?.name), value: TextGetter.getterString(selectSubDistrict?.id) });
            }
        }
        setLoading(false);
    };

    const fetchListUrbanVillageDomicile = async (subDistrictId: string, firstLoad: boolean = true) => {
        setLoading(true);
        const { result, error } = await useKelurahanListFetcher(baseUrl, { "kecamatan-id": subDistrictId, limit: 100 });
        if (result && !error) {
            setListUrbanVillageDomicile(result.data.map(data => ({
                label: data.name,
                value: data.id,
            })));
            if (firstLoad) {
                const selectUrbanVillage = result.data.find((e) => e.id === memberKYCDetail?.memberResidence.kelurahanId);
                setValue('urbanVillageIdDomicile', { label: TextGetter.getterString(selectUrbanVillage?.name), value: TextGetter.getterString(selectUrbanVillage?.id) });
            }
        }
        setLoading(false);
    };

    const handleCancel = async () => {
        const confirmed = await getConfirmation({
            title: tCommon('confirmationCancelUpdateTitle', { text: 'Member' }),
            message: tCommon('confirmationCancelUpdateDescription'),
            primaryText: tCommon('confirmationCancelUpdateYes'),
            secondaryText: tCommon('confirmationCancelUpdateNo'),
            btnPrimaryColor: 'inherit',
            btnSecondaryColor: 'error'
        });

        if (confirmed) {
            onHide();
        }
    };

    const handleUpsert = handleSubmit(async (form) => {
        const confirmed = await getConfirmation({
            title: tCommon('confirmationUpdateTitle', { text: 'Member' }),
            message: tCommon('confirmationUpdateDescription', { text: 'Member' }),
            primaryText: tCommon('confirmationUpdateYes'),
            secondaryText: tCommon('confirmationUpdateNo'),
        });

        if (confirmed) {
            const { error, errorData } = await useKYCUpdateAddressFetcher(baseUrl, selectedData.id, {
                provinceId: TextGetter.getterString(form.province?.value),
                cityId: TextGetter.getterString(form.cityId?.value),
                subDistrictId: TextGetter.getterString(form.subDistrictId?.value),
                urbanVillageId: TextGetter.getterString(form.urbanVillageId?.value),
                postalCode: parseInt(form.postalCode),
                address: TextGetter.getterString(form.address),

                isResidenceSameWithIdentityCard: isAddressSame,

                provinceIdDomicile: TextGetter.getterString(isAddressSame ? form.province?.value : form.provinceDomicile?.value),
                cityIdDomicile: TextGetter.getterString(isAddressSame ? form.cityId?.value : form.cityIdDomicile?.value),
                subDistrictIdDomicile: TextGetter.getterString(isAddressSame ? form.subDistrictId?.value : form.subDistrictIdDomicile?.value),
                urbanVillageIdDomicile: TextGetter.getterString(isAddressSame ? form.urbanVillageId?.value : form.urbanVillageIdDomicile?.value),
                postalCodeDomicile: parseInt(isAddressSame ? form.postalCode : form.postalCodeDomicile),
                addressDomicile: TextGetter.getterString(isAddressSame ? form.address : form.addressDomicile),
            });

            if (!error) {
                fetchMemberKYCHistoryDetail(selectedData.id);
                enqueueSnackbar(tCommon('successUpdateAddress', { text: 'Member' }), { variant: 'info' });
                onHide();
            } else {
                let errorMessage = errorData?.details?.[0];
                if (!errorMessage) {
                    errorMessage = tCommon('failedUpdate', { text: 'Member' });
                } else {
                    errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
                }
                enqueueSnackbar(errorMessage, { variant: 'info' });
            }
        }
    });

    useEffect(() => {
        if (memberKYCDetail) {
            const sameAddress = memberKYCDetail.premiumMember.isResidenceSameWithIdentityCard;
            fetchListProvinceIdentity('c727a474-0ffc-4497-9b2c-6c7f291895bc');
            fetchListProvinceDomicile('c727a474-0ffc-4497-9b2c-6c7f291895bc');

            fetchListCityIdentity(memberKYCDetail?.identityCard.provinceId);
            fetchListSubDistrictIdentity(memberKYCDetail?.identityCard.cityId);
            fetchListUrbanVillageIdentity(memberKYCDetail?.identityCard.kecamatanId);

            fetchListCityDomicile(sameAddress ? memberKYCDetail?.identityCard.provinceId : memberKYCDetail?.memberResidence.provinceId);
            fetchListSubDistrictDomicile(sameAddress ? memberKYCDetail?.identityCard.cityId : memberKYCDetail?.memberResidence.cityId);
            fetchListUrbanVillageDomicile(sameAddress ? memberKYCDetail?.identityCard.kecamatanId : memberKYCDetail?.memberResidence.kecamatanId);
        }
    }, []);


    return {
        formData,
        handleUpsert,
        handleCancel,
        loading,
        listProvinceIdentity,
        listCityIdentity,
        listSubDistrictIdentity,
        listUrbanVillageIdentity,
        fetchListProvinceIdentity,
        handleCheckboxChange,
        isAddressSame,
        fetchListCityIdentity,
        fetchListSubDistrictIdentity,
        fetchListUrbanVillageIdentity,
        listProvinceDomicile,
        listSubDistrictDomicile,
        listCityDomicile,
        fetchListSubDistrictDomicile,
        fetchListProvinceDomicile,
        fetchListCityDomicile,
        listUrbanVillageDomicile,
        fetchListUrbanVillageDomicile,
        setIsAddressSame,
    };
}

export default useUpdateAddressUpsert;