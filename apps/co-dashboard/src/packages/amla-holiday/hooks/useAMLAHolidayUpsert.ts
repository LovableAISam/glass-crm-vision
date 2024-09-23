import {
  useAMLAHolidayCreateFetcher,
} from "@woi/service/co";
import { useSnackbar } from "notistack";
import { useConfirmationDialog } from "@woi/web-component";
import { stringToDateFormat } from "@woi/core/utils/date/dateConvert";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useTranslation } from "react-i18next";

export interface HolidayForm {
  holidayName: string;
  date: Date | null;
}

const initialHolidayForm: HolidayForm = {
  holidayName: '',
  date: null,
};

interface AMLAHolidayUpsertProps {
  onHide: () => void;
  fetchAMLAHolidayList: () => void;
}

function useAMLAHolidayUpsert(props: AMLAHolidayUpsertProps) {
  const { onHide, fetchAMLAHolidayList } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');
  const { t: tAMLAHoliday } = useTranslation('amlaHoliday');

  const formData = useForm<HolidayForm>({
    defaultValues: initialHolidayForm,
  });
  const { handleSubmit, setValue } = formData;

  const handleUpsert = handleSubmit(async (form) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCreateTitle', { text: tAMLAHoliday('confirmTitle') }),
      message: tCommon('confirmationCreateDescription', { text: tAMLAHoliday('confirmDescription') }),
      primaryText: tCommon('confirmationCreateYes'),
      secondaryText: tCommon('confirmationCreateNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useAMLAHolidayCreateFetcher(baseUrl, {
        date: stringToDateFormat(form.date),
        description: form.holidayName,
        admin: ''
      });

      if (!error) {
        enqueueSnackbar(tCommon('successAdd', { text: tAMLAHoliday('confirmTitle') }
        ), { variant: 'info' });
        onHide();
        fetchAMLAHolidayList();
      } else {
        let errorMessage = errorData?.details?.[0];
        if (!errorMessage) {
          errorMessage = tCommon('failedCreate', { text: tAMLAHoliday('confirmTitle') });
        } else {
          errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
        }
        enqueueSnackbar(errorMessage, { variant: 'info' });
      }
    }
  });

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: tAMLAHoliday('confirmTitle') }),
      message: tCommon('confirmationCancelCreateDescription'),
      primaryText: tCommon('confirmationCancelCreateYes'),
      secondaryText: tCommon('confirmationCancelCreateNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  };

  return {
    formData,
    handleUpsert,
    handleCancel,
    setValue
  };
}

export default useAMLAHolidayUpsert;