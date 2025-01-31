import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BalanceInquiryList from '@src/packages/merchant/balance-inquiry/BalanceInquiryList';

const AccountHistoryPage = () => (
  <DashboardContainer>
    <BalanceInquiryList />
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
        'form',
        'account',
      ])),
    },
  };
};

export default AccountHistoryPage;
