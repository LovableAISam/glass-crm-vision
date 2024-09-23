import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import ActivityMemberHistoryList from '@src/packages/activity-member-history/ActivityMemberHistoryList';

const ActivityMemberHistoryPage = () => (
  <DashboardContainer>
    <ActivityMemberHistoryList />
  </DashboardContainer>
);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'activityMember',
        'form',
        'co',
        'report',
      ])),
    },
  };
};

export default ActivityMemberHistoryPage;
