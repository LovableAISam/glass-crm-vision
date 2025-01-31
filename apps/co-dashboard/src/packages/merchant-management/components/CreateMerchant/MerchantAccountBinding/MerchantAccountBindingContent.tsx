// Core
import { Dispatch, SetStateAction, useState } from "react";

// Component
import MerchantData from './content/MerchantData';
import SettlementInformation from './content/SettlementInformation';
import { CreateMerchantModalContentProps } from '../CreateMerchantModalContent';

// Hooks & Utils
import { UseFormReturn } from 'react-hook-form';
import useMerchantAccountBindingUpsert from "@src/packages/merchant-management/hooks/useMerchantAccountBindingUpsert";

// Types & Consts
import { MerchantForm } from '@src/packages/merchant-management/hooks/useMerchantAccountBindingUpsert';
import { OptionMap } from '@woi/option';
import { MerchantDetail } from "@woi/service/co/merchant/merchantDetail";

export type AccountBindingContentProps = {
  formData: UseFormReturn<MerchantForm, any>;
  isLoading: boolean;
  fetchCityList: (id: string) => void;
  handleCancel: () => void;
  handleSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  fetchProvinceList: (id: string, updateReload?: boolean) => void;
  provinceOptions: OptionMap<string>[];
  cityOptions: OptionMap<string>[];
  fetchDistrictList: (id: string) => void;
  fetchVillageList: (id: string) => void;
  districtOptions: OptionMap<string>[];
  villageOptions: OptionMap<string>[];
  qrTypeOptions: OptionMap<string>[];
  merchantTypeOptions: OptionMap<string>[];
  merchantCriteriaOptions: OptionMap<string>[];
  merchantCategoryOptions: OptionMap<string>[];
  merchantLocationOptions: OptionMap<string>[];
  doubleAuthorize: boolean;
  setDoubleAuthorize: Dispatch<SetStateAction<boolean>>;
  handleBack: () => void;
  handleNext: () => void;

  merchantDetail: MerchantDetail | null;
  validateForm: (callback: () => void) => void;
  activeStep: number;
  completed: { [k: number]: boolean; };
  setActiveStep: Dispatch<SetStateAction<number>>;
};

function MerchantAccountBindingContent(props: CreateMerchantModalContentProps) {
  const {
    setSelectEdit,
    onHide,
    merchantDetail,
    fetchMerchantList,
    merchantFor,
    isUpdate,
  } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean; }>({});

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleComplete = (step: number) => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep(step);
  };

  const validateForm = (callback: () => void) => {
    handleComplete(activeStep + 1);
    callback();
  };

  const dataProps = useMerchantAccountBindingUpsert({
    setSelectEdit,
    onHide,
    isUpdate,
    merchantDetail,
    fetchMerchantList,
    activeStep,
    setActiveStep,
    handleComplete,
    merchantFor,
  });

  const allProps: AccountBindingContentProps = {
    ...dataProps,
    merchantDetail: merchantDetail,
    handleBack: handleBack,
    handleNext: handleNext,
    validateForm: validateForm,
    activeStep: activeStep,
    setActiveStep: setActiveStep,
    completed: completed
  };

  switch (activeStep) {
    case 0:
      // @ts-ignore
      return <MerchantData {...allProps} />;
    case 1:
      return <SettlementInformation {...allProps} />;
    // @ts-ignore
    default:
      return null;
  }
}

export default MerchantAccountBindingContent;
