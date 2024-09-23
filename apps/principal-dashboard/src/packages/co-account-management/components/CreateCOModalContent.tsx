import React from 'react';
import dynamic from 'next/dynamic';
import { CommunityOwnerData } from '@woi/service/principal/admin/communityOwner/communityOwnerList';

const AccountInformation = dynamic(() => import('./AccountInformation'));
const IdentityData = dynamic(() => import('./IdentityData'));
const PICData = dynamic(() => import('./PICData'));
const Configuration = dynamic(() => import('./Configuration'));

export type CreateCOModalContentProps = {
  selectedData: CommunityOwnerData | null;
  activeStep: number;
  completed: { [k: number]: boolean };
  handleStep: (step: number) => void;
  handleComplete: (step: number) => void;
  handleCancel: () => void;
  handleHide: () => void;
  handleReloadList: () => void;
};

function CreateCOModalContent(props: CreateCOModalContentProps) {
  const { activeStep } = props;

  switch (activeStep) {
    case 0:
      // @ts-ignore
      return <AccountInformation {...props} />;
    case 1:
      // @ts-ignore
      return <IdentityData {...props} />;
    case 2:
      // @ts-ignore
      return <PICData {...props} />;
    case 3:
      // @ts-ignore
      return <Configuration {...props} />;
    default:
      return null;
  }
}

export default CreateCOModalContent;
