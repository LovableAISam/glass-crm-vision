import { useMemo, useState } from "react";
import { useCommunityOwnerListFetcher } from "@woi/service/principal";
import { useConfirmationDialog } from "@woi/web-component";
import { OptionMap } from "@woi/option";
import { useForm } from 'react-hook-form';
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import useRouteRedirection from "@src/shared/hooks/useRouteRedirection";
import { useQuery } from "@tanstack/react-query";

export interface AppCustomizationForm {
  co: OptionMap<string> | null;
}

const initialAppCustomizationForm: AppCustomizationForm = {
  co: null,
};

interface AppCustomizationUpsertProps {
  onHide: () => void;
}

function useAppCustomizationUpsert(props: AppCustomizationUpsertProps) {
  const { onHide } = props;
  const { getConfirmation } = useConfirmationDialog();
  const { onNavigate } = useRouteRedirection();
  const { baseUrl } = useBaseUrl();

  const formData = useForm<AppCustomizationForm>({
    defaultValues: initialAppCustomizationForm,
  });
  const { handleSubmit } = formData;
  const [loading] = useState<boolean>(false);

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: `Cancel Create App Customization?`,
      message: `The changes will be deleted from the form field. This action can not be undo.`,
      primaryText: `Cancel`,
      secondaryText: 'Back to Editing',
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  };

  const { data: coData } = useQuery(
    ['co-list'],
    async () => await useCommunityOwnerListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
      hideAppCustom: true,
      status: ['ACTIVATED']
    }),
    { refetchOnWindowFocus: false }
  );

  const coOptions = useMemo(() => {
    if (!coData) return [];
    return (coData.result?.data || []).map(data => ({
      label: data.name,
      value: data.id,
    }));
  }, [coData]);

  const handleUpsert = handleSubmit(async (form) => {
    if (form.co) {
      onNavigate({ pathname: `/app-customization/create/${form.co.value}` });
    }
  });

  return {
    coOptions,
    formData,
    loading,
    handleUpsert,
    handleCancel,
  };
}

export default useAppCustomizationUpsert;