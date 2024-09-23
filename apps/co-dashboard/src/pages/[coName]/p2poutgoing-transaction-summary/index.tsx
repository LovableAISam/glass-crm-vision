import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import P2PTransactionSummaryList from '@src/packages/p2poutgoing-transaction-summary/P2PTransactionSummaryList';

const COTransactionSummaryPage = () => (
  <DashboardContainer>
    <P2PTransactionSummaryList />
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
        'report',
        'form',
      ])),
    },
  };
};

export default COTransactionSummaryPage;
