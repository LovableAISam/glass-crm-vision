import React from 'react';
import dynamic from 'next/dynamic';

const AccountInformation = dynamic(() => import('./content/AccountInformation'));
const PersonalData = dynamic(() => import('./content/PersonalData'));

export type ViewManageMemberTabProps = {
  activeTab: number;
};

function ViewManageMemberTab(props: ViewManageMemberTabProps) {
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

export default ViewManageMemberTab;