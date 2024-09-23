import React from 'react';
import dynamic from 'next/dynamic';
import { KycPremiumMemberDetailForm, MemberDetailForm } from '../../hooks/useKycRequstUpsert';

const AccountInformation = dynamic(() => import('./content/AccountInformation'));
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewKYCRequestTabProps = {
  activeTab: number;
  kycDetail: KycPremiumMemberDetailForm | null;
  memberDetail: MemberDetailForm | null;
};

function ViewKYCRequestTab(props: ViewKYCRequestTabProps) {
  const { activeTab } = props;

  switch (activeTab) {
    case 0:
      // @ts-ignore
      return <AccountInformation {...props} />;
    case 1:
      // @ts-ignore
      return <PersonalData {...props} />;
    default:
      return null;
  }
}

export default ViewKYCRequestTab;