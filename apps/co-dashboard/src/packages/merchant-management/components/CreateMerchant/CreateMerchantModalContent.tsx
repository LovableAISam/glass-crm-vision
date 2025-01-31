import React, { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';
import { MerchantDataList } from '@woi/service/co/merchant/merchantList';

const MerchantQRISAcquirerContent = dynamic(
  () => import('./MerchantQRISAcquirer/MerchantQRISAcquirerContent'),
);
const MerchantAccountBindingContent = dynamic(
  () => import('./MerchantAccountBinding/MerchantAccountBindingContent'),
);
const CreateMerchantPartner = dynamic(
  () => import('./MerchantPartner/CreateMerchantPartner'),
);

export type CreateMerchantModalContentProps = {
  isActive: boolean;
  isUpdate: boolean;
  onHide: () => void;
  merchantDetail: MerchantDetail | null;
  selectEdit: MerchantDataList | null;
  fetchMerchantList: () => void;
  setSelectEdit: Dispatch<SetStateAction<MerchantDataList | null>>;
  merchantFor: { label: string; value: string };
  setMerchantFor: Dispatch<SetStateAction<{ label: string; value: string }>>;
  merchantForOptions: { label: string; value: string }[];
};

function CreateMerchantModalContent(props: CreateMerchantModalContentProps) {
  const { merchantFor } = props;

  switch (merchantFor.label) {
    case 'Merchant QRIS Acquirer':
      // @ts-ignore
      return <MerchantQRISAcquirerContent {...props} />;
    case 'Merchant Account Binding':
      // @ts-ignore
      return <MerchantAccountBindingContent {...props} />;
    case 'Merchant Third Party/Business Partner':
      // @ts-ignore
      return <CreateMerchantPartner {...props} />;
    default:
      // @ts-ignore
      return <CreateMerchantPartner {...props} />;
  }
}

export default CreateMerchantModalContent;
