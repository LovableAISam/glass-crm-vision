import { useEffect, useState } from "react";
import { useBankUpdateFetcher, useBankCreateFetcher, useBankDetailFetcher, useUploadTemporaryImageFetcher } from "@woi/service/principal";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import { BankData, BankStatus } from "@woi/service/principal/admin/bank/bankList";
import { FileConvert, TextGetter } from "@woi/core";
import { UploadDocumentData } from "@woi/uploadDocument";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";

export interface BankForm {
  backgroundCard: UploadDocumentData | null;
  color: string;
  fullName: string;
  logo: UploadDocumentData | null;
  name: string;
  status: OptionMap<BankStatus> | null;
  isActive: boolean;
}

const initialBankForm: BankForm = {
  backgroundCard: null,
  color: '',
  fullName: '',
  logo: null,
  name: '',
  status: null,
  isActive: false,
}

interface BankUpsertProps {
  selectedData: BankData | null;
  onHide: () => void;
  fetchBankList: () => void;
}

function useBankUpsert(props: BankUpsertProps) {
  const { selectedData, onHide, fetchBankList } = props;
  const isUpdate = Boolean(selectedData);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const statusOptions: OptionMap<BankStatus>[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Disabled', value: 'DISABLED' },
    { label: 'Verify', value: 'VERIFY' },
  ];
  const { baseUrl } = useBaseUrl();

  const formData = useForm<BankForm>({
    defaultValues: initialBankForm,
  });
  const { handleSubmit, setValue, getValues } = formData;
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: `Cancel Create Bank?`,
      message: `The changes will be deleted from the form field. This action can not be undo.`,
      primaryText: `Cancel`,
      secondaryText: 'Back to Editing',
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  }

  const handleActivateDeactivate = async () => {
    const isActive = getValues('isActive');

    const confirmed = await getConfirmation({
      title: `${isActive ? 'Deactivate' : 'Activate'} Bank?`,
      message: `Are you sure want to ${isActive ? 'deactivate' : 'activate'} this bank`,
      primaryText: `${isActive ? 'Deactivate' : 'Activate'}`,
      secondaryText: 'Cancel'
    });

    if (confirmed) {
      enqueueSnackbar(`Bank data has been ${isActive ? 'deactivate' : 'activate'}.`, { variant: 'info' });
    }
  }

  const handleUploadBankLogo = async (file: File | null) => {
    if (!file) {
      setValue('logo', null)
      return;
    }
    const { result, error, errorData } = await useUploadTemporaryImageFetcher(baseUrl, {
      upload: file,
    });
    if (result && !error) {
      const dataUri = await FileConvert.getDataUriFromFile(file);
      setValue('logo', {
        docPath: result.url,
        fileName: file.name,
        fileData: file,
        imageUri: dataUri as string,
      })
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Upload Gagal!', { variant: 'error' })
    }
  }

  const handleUploadBackgroundCard = async (file: File | null) => {
    if (!file) {
      setValue('backgroundCard', null)
      return;
    }
    const { result, error, errorData } = await useUploadTemporaryImageFetcher(baseUrl, {
      upload: file,
    });
    if (result && !error) {
      const dataUri = await FileConvert.getDataUriFromFile(file);
      setValue('backgroundCard', {
        docPath: result.url,
        fileName: file.name,
        fileData: file,
        imageUri: dataUri as string,
      })
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Upload Gagal!', { variant: 'error' })
    }
  }

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation({
      title: `${isUpdate ? 'Update' : 'Create'} Bank`,
      message: `Do you really want to ${isUpdate ? 'update' : 'create'} bank?`,
      primaryText: `${isUpdate ? 'Update' : 'Create'}`,
      secondaryText: 'Cancel',
    });

    if (confirmed) {
      const payload = {
        backgroundCard: TextGetter.getterString(form.backgroundCard?.docPath),
        color: form.color,
        fullName: form.fullName,
        logo: TextGetter.getterString(form.logo?.docPath),
        name: form.name,
        status: form.status?.value || null,
      }
      const { error, errorData } = isUpdate
        ? await useBankUpdateFetcher(baseUrl, selectedData!.id, payload)
        : await useBankCreateFetcher(baseUrl, payload)
      if (!error) {
        enqueueSnackbar(`${isUpdate ? 'Bank details changes saved.' : 'Bank successfully added!'}`, { variant: 'success' });
        onHide();
        fetchBankList();
      } else {
        enqueueSnackbar(errorData?.details?.[0] || `${isUpdate ? 'Update' : 'Create'} Bank failed!`, { variant: 'error' });
      }
    }
  })

  const fetchUserDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useBankDetailFetcher(baseUrl, id);

    if (result && !error) {
      if (result.backgroundCard) {
        setValue('backgroundCard', { docPath: result.backgroundCard });
      }
      setValue('color', result.color);
      setValue('fullName', result.fullName);
      if (result.logo) {
        setValue('logo', { docPath: result.logo });
      }
      setValue('name', result.name);
      setValue('status', statusOptions.find(option => option.value === result.status) || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedData) {
      fetchUserDetail(selectedData.id);
    }
  }, [selectedData])

  return {
    handleUploadBankLogo,
    handleUploadBackgroundCard,
    statusOptions,
    formData,
    loading,
    handleUpsert,
    handleCancel,
    handleActivateDeactivate,
  }
}

export default useBankUpsert;