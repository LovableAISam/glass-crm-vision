import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import TransactionTypeManagementList from '@src/packages/transaction-type-management/TransactionTypeManagementList';

const TransactionTypeManagementListPage = () => (
  <DashboardContainer>
    <TransactionTypeManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'transactionType', 'form'])),
    },
  }
}

export default TransactionTypeManagementListPage;
