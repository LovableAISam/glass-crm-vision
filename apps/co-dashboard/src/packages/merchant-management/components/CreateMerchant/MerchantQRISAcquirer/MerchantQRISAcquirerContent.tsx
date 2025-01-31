// Core
import { Dispatch, SetStateAction, useState } from "react";

// Component
import MerchantData from './content/MerchantData';
import MerchantData2 from './content/MerchantData2';
import SettlementInformation from './content/SettlementInformation';

// Hooks & Utils
import useMerchantQRISAcquirerUpsert from '@src/packages/merchant-management/hooks/useMerchantQRISAcquirerUpsert';
import { UseFormReturn } from 'react-hook-form';

// Types & Consts
import { MerchantForm } from '@src/packages/merchant-management/hooks/useMerchantQRISAcquirerUpsert';
import { OptionMap } from '@woi/option';
import { MerchantDetail } from "@woi/service/co/merchant/merchantDetail";
import { CreateMerchantModalContentProps } from '../CreateMerchantModalContent';

export type QRISAcquirerContentProps = {
  formData: UseFormReturn<MerchantForm, any>;
  isLoading: boolean;
  handleCancel: () => void;
  handleSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  fetchProvinceList: (id: string, updateReload?: boolean) => void;
  provinceOptions: OptionMap<string>[];
  fetchCityList: (id: string) => void;
  cityOptions: OptionMap<string>[];
  fetchDistrictList: (id: string) => void;
  districtOptions: OptionMap<string>[];
  fetchVillageList: (id: string) => void;
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

function MerchantQRISAcquirerContent(props: CreateMerchantModalContentProps) {
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

  const dataHooks = useMerchantQRISAcquirerUpsert({
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

  const allProps: QRISAcquirerContentProps = {
    ...dataHooks,
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
      // @ts-ignore
      return <MerchantData2 {...allProps} />;
    case 2:
      return <SettlementInformation {...allProps} />;
    // @ts-ignore
    default:
      return null;
  }
}

export default MerchantQRISAcquirerContent;
