import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import EventManagementList from '@src/packages/event-management/EventManagementList';

const EventManagementListPage = () => (
  <DashboardContainer>
    <EventManagementList />
  </DashboardContainer>
)

export default EventManagementListPage;
