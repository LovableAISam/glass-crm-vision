// Hooks & Utils
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

// Types & Consts
import { OptionMap } from "@woi/option";

export interface UserForm {
  amount: string;
  balance: string;
  action: OptionMap<string> | null;
  password: string;
  reason: string;
}

const initialUserForm: UserForm = {
  amount: '',
  balance: '',
  action: null,
  password: '',
  reason: '',
};

function useBalanceCorrectionHistoryView() {
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');

  const actionOptions = <OptionMap<string>[]>([
    {
      label: tBalanceCorrection('optionDeduct'),
      value: 'DEDUCT',
    },
    {
      label: tBalanceCorrection('optionTopUp'),
      value: 'TOPUP',
    },
  ]);

  const formData = useForm<UserForm>({
    defaultValues: initialUserForm,
  });

  return {
    formData,
    actionOptions
  };
}

export default useBalanceCorrectionHistoryView;
