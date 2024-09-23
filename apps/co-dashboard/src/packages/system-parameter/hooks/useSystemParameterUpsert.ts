import { Dispatch, SetStateAction, useEffect } from "react";
import { OptionMap } from "@woi/option";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";

// Types & Consts
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useSystemParameterCreateFetcher, useSystemParameterDetailFetcher, useSystemParameterUpdateFetcher } from "@woi/service/co";
import { SystemParameterData } from "@woi/service/co/admin/systemParameter/systemParameterList";

export interface SystemParameterForm {
  code: string;
  valueType: OptionMap<string> | null;
  valueText: string;
  valueDate: Date | null;
  description: string;
}

const initialSystemParameterForm: SystemParameterForm = {
  code: '',
  valueType: null,
  valueText: '',
  valueDate: null,
  description: ''
};

interface SystemParameterUpsertProps {
  onHide: () => void;
  selectedData: SystemParameterData | null;
  fetchSystemParameterList: () => void;
  showModal: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<SystemParameterData | null>>;
}

function useSystemParameterUpsert(props: SystemParameterUpsertProps) {
  const { onHide, selectedData, fetchSystemParameterList, showModal, setLoading, setSelectedId } = props;
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');
  const isUpdate = Boolean(selectedData);
  const formData = useForm<SystemParameterForm>({
    defaultValues: initialSystemParameterForm,
  });
  const { setValue, handleSubmit, getValues, reset, resetField } = formData;
  const valueTypeOptions = <OptionMap<string>[]>([{
    label: 'Text',
    value: 'text',
  }, {
    label: 'Date',
    value: 'date',
  }]);

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation(isUpdate ? {
      title: tCommon('confirmationUpdateTitle', { text: 'system parameter' }),
      message: tCommon('confirmationUpdateDescription', { text: 'system parameter' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    } : {
      title: tCommon('confirmationCreateTitle', { text: 'system parameter' }),
      message: tCommon('confirmationCreateDescription', { text: 'system parameter' }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });
    if (confirmed) {
      setLoading(true);
      const payload = {
        code: form.code,
        valueType: form.valueType?.label || '',
        valueText: form.valueType?.label === 'Text' ? form.valueText : '',
        valueDate: '',
        description: form.description || ''
      };
      if (form.valueType?.label === 'Date') {
        payload.valueDate = form.valueDate ? form.valueDate.toISOString().substr(0, 10) : '';
      }
      const { error, errorData } = isUpdate
        ? await useSystemParameterUpdateFetcher(baseUrl, selectedData?.id || '', payload)
        : await useSystemParameterCreateFetcher(baseUrl, payload);
      setLoading(false);
      if (!error) {
        enqueueSnackbar(isUpdate
          ? tCommon('successUpdate', { text: 'System Parameter' })
          : tCommon('successAdd', { text: 'System Parameter' }
          ), { variant: 'info' });
        onHide();
        reset();
        setSelectedId(null);
        fetchSystemParameterList();
      } else {
        let errorMessage;
        if (errorData?.details?.[0]) {
          errorMessage = errorData.details[0].charAt(0).toUpperCase() + errorData.details[0].slice(1);
        } else if (isUpdate) {
          errorMessage = tCommon('failedUpdate', { text: 'System Parameter' });
        } else {
          errorMessage = tCommon('failedCreate', { text: 'System Parameter' });
        }
        enqueueSnackbar(errorMessage, { variant: 'info' });
      }
    }
  });

  const fetchDetailData = async (id: string) => {
    setLoading(true);
    const detailResponse = await
      useSystemParameterDetailFetcher(baseUrl, id);
    const { result: resultDetail, error: errorDetail } = detailResponse;
    if (resultDetail && !errorDetail) {
      setValue('code', resultDetail.code);
      setValue('description', resultDetail.description);
      setValue('valueType', valueTypeOptions.find((item) => item.label == resultDetail.valueType) || null);
      if (resultDetail.valueType === 'Text') {
        setValue('valueText', resultDetail.valueText);
      } else {
        setValue('valueDate', new Date(resultDetail.valueDate));
      }
      showModal();
    } else {
      enqueueSnackbar(
        errorDetail?.message, { variant: 'info' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedData) {
      fetchDetailData(selectedData.id);
    }
  }, [selectedData]);

  return {
    formData,
    valueTypeOptions,
    setValue,
    handleUpsert,
    getValues,
    reset,
    resetField
  };
}

export default useSystemParameterUpsert;