import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { CommunityOwnerContact } from "@woi/communityOwner";
import { OptionMap } from "@woi/option";
import { useReferralListFetcher } from "@woi/service/principal";
import { useConfirmationDialog } from "@woi/web-component";

// Hooks
import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ContactUpsertProps {
  selectedData: CommunityOwnerContact | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerContact) => void;
}

function useContactUpsert(props: ContactUpsertProps) {
  const { selectedData, onSubmit, onHide } = props;
  const formData = useForm<CommunityOwnerContact>({
    defaultValues: selectedData || {
      number: '',
      type: null,
    },
  });
  const { handleSubmit } = formData;
  const [contactTypeOptions, setContactTypeOptions] = useState<OptionMap<string>[]>([]);
  const { baseUrl } = useBaseUrl();
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = handleSubmit((form) => {
    enqueueSnackbar(tCommon('successAdd', { text: 'User Contact' }), {
      variant: 'success',
    });
    onSubmit(form);
  })

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create User Contact' }),
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

  const fetchFundTypeList = async () => {
    const { result, error } = await useReferralListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
      type: 'CONTACT_TYPE'
    });

    if (result && !error) {
      setContactTypeOptions(result.data.map(data => ({
        label: data.code,
        value: data.value,
      })))
    }
  }

  useEffect(() => {
    fetchFundTypeList();
  }, [])

  return {
    contactTypeOptions,
    formData,
    handleSave,
    handleCancel,
  }
}

export default useContactUpsert;