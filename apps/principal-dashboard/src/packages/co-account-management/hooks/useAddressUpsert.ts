import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { CommunityOwnerAddress } from "@woi/communityOwner";
import { OptionMap } from "@woi/option";
import { useCityListFetcher, useCountryListFetcher, useProvinceListFetcher } from "@woi/service/principal";
import { useConfirmationDialog } from "@woi/web-component";

// Hooks
import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AddressUpsertProps {
  selectedData: CommunityOwnerAddress | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerAddress) => void;
}

function useAddressUpsert(props: AddressUpsertProps) {
  const { selectedData, onSubmit, onHide } = props;
  const formData = useForm<CommunityOwnerAddress>({
    defaultValues: selectedData || {
      address: '',
      cityId: null,
      countryId: null,
      postalCode: '',
      provinceId: null,
    },
  });
  const { handleSubmit } = formData;
  const [countryOptions, setCountryOptions] = useState<OptionMap<string>[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<OptionMap<string>[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionMap<string>[]>([]);
  const { baseUrl } = useBaseUrl();
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = handleSubmit((form) => {
    enqueueSnackbar(tCommon('successAdd', { text: 'User Address' }), {
      variant: 'success',
    });
    onSubmit(form);
  })

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create User Address' }),
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  }

  const fetchCountryList = async () => {
    const { result, error } = await useCountryListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setCountryOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const fetchProvinceList = async (id: string) => {
    const { result, error } = await useProvinceListFetcher(baseUrl, {
      'country-id': id,
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setProvinceOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  const fetchCityList = async (id: string) => {
    const { result, error } = await useCityListFetcher(baseUrl, {
      'province-id': id,
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setCityOptions(result.data.map(data => ({
        label: data.name,
        value: data.id,
      })))
    }
  }

  useEffect(() => {
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (selectedData) {
      if (selectedData.countryId) {
        fetchProvinceList(selectedData.countryId.value);
      }
      if (selectedData.provinceId) {
        fetchCityList(selectedData.provinceId.value);
      }
    }
  }, [selectedData]);

  return {
    countryOptions,
    provinceOptions,
    cityOptions,
    formData,
    handleSave,
    fetchProvinceList,
    fetchCityList,
    handleCancel
  }
}

export default useAddressUpsert;