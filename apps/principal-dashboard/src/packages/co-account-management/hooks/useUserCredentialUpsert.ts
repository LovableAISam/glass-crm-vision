import { CommunityOwnerUserOTP } from "@woi/communityOwner";
import { useConfirmationDialog } from "@woi/web-component";

// Hooks
import { useSnackbar } from 'notistack';
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface UserCredentialUpsertProps {
  selectedData: CommunityOwnerUserOTP | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerUserOTP) => void;
}

function useUserCredentialUpsert(props: UserCredentialUpsertProps) {
  const { selectedData, onSubmit, onHide } = props;
  const formData = useForm<CommunityOwnerUserOTP>({
    defaultValues: selectedData || {
      channel: '',
      division: '',
      password: '',
      sender: '',
      username: '',
    },
  });
  const { handleSubmit } = formData;
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = handleSubmit((form) => {
    enqueueSnackbar(tCommon('successAdd', { text: 'User Credential' }), {
      variant: 'success',
    });
    onSubmit(form);
  })

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Create User Credential' }),
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

  return {
    formData,
    handleSave,
    handleCancel,
  }
}

export default useUserCredentialUpsert;