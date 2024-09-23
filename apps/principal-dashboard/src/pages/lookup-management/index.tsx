import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import LookupManagementList from '@src/packages/lookup-management/LookupManagementList';

const LookupManagementPage = () => (
  <DashboardContainer>
    <LookupManagementList />
  </DashboardContainer>
)

export default LookupManagementPage;
