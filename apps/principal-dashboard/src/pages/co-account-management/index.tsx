import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import COAccountManagementList from '@src/packages/co-account-management/COAccountManagementList';

const COAccountManagementPage = () => (
  <DashboardContainer>
    <COAccountManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'co', 'form'])),
    },
  }
}

export default COAccountManagementPage;
