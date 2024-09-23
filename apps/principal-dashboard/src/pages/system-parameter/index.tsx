import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import SystemParameterList from '@src/packages/system-parameter/SystemParameterList';

const SystemParameterListPage = () => (
  <DashboardContainer>
    <SystemParameterList />
  </DashboardContainer>
)

export default SystemParameterListPage;
