import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BankManagementList from '@src/packages/bank-management/BankManagementList';

const BankManagementPage = () => (
  <DashboardContainer>
    <BankManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'bank', 'form'])),
    },
  }
}

export default BankManagementPage;
