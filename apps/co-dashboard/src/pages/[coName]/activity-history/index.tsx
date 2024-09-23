import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import ActivityHistoryList from '@src/packages/activity-history/ActivityHistoryList';

const ActivityHistoryPage = () => (
  <DashboardContainer>
    <ActivityHistoryList />
  </DashboardContainer>
);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'co',
        'form',
        'report'
      ])),
    },
  };
}

export default ActivityHistoryPage;
