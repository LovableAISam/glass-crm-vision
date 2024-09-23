import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BankFAQScreenList from '@src/packages/bank-faq-screen/BankFAQScreenList';

const BankFAQScreenListPage = () => (
  <DashboardContainer>
    <BankFAQScreenList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'bankFAQ', 'form'])),
    },
  }
}

export default BankFAQScreenListPage;
