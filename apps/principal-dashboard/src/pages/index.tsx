import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import Dashboard from '@src/packages/dashboard/Dashboard';

const Index = () => (
  <DashboardContainer>
    <Dashboard />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || 'en', ['common']),
  },
})

export default Index;
