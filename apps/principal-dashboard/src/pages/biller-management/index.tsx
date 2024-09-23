import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BillerManagementList from '@src/packages/biller-management/BillerManagementList';

const BillerManagementListPage = () => (
  <DashboardContainer>
    <BillerManagementList />
  </DashboardContainer>
)

export default BillerManagementListPage;
