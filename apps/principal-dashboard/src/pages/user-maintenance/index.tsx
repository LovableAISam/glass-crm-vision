import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import UserMaintenanceList from '@src/packages/user-maintenance/UserMaintenanceList';

const UserMaintenancePage = () => (
  <DashboardContainer>
    <UserMaintenanceList />
  </DashboardContainer>
)

export default UserMaintenancePage;
