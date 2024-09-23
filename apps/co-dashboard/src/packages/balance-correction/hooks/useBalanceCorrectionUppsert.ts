// Hooks & Utils
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Types & Consts
import { OptionMap } from "@woi/option";
import { CorrectionType } from "@woi/service/co/admin/balanceCorrection/createBalanceCorrection";
import { useState } from "react";

export interface CorrectionDataForm {
  amount: string;
  balance: string;
  action: OptionMap<CorrectionType> | null;
  password: string;
  reason: string;
}

const initialCorrectionDataForm: CorrectionDataForm = {
  amount: '',
  balance: '',
  action: null,
  password: '',
  reason: '',
};

function useBalanceCorrectionUppsert() {
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');

  const actionOptions = <OptionMap<'DEDUCT' | 'TOPUP'>[]>([
    {
      label: tBalanceCorrection('optionDeduct'),
      value: 'DEDUCT',
    },
    {
      label: tBalanceCorrection('optionTopUp'),
      value: 'TOPUP',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const formData = useForm<CorrectionDataForm>({
    defaultValues: initialCorrectionDataForm,
  });

  const { handleSubmit } = formData;

  return {
    handleSubmit,
    formData,
    actionOptions,
    isLoading,
    setIsLoading
  };
}

export default useBalanceCorrectionUppsert;
