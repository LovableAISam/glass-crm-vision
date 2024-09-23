import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import ActivityHistoryList from '@src/packages/activity-history/ActivityHistoryList';

const ActivityHistoryPage = () => (
  <DashboardContainer>
    <ActivityHistoryList />
  </DashboardContainer>
)

export default ActivityHistoryPage;
