import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BalanceCorrectionHistoryList from "@src/packages/balance-correction-history/BalanceCorrectionHistoryList";

const BalanceCorrectionHistoryPage = () => (
  <DashboardContainer>
    <BalanceCorrectionHistoryList />
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
        'balanceCorrection',
        'kyc',
        'form',
      ])),
    },
  };
};

export default BalanceCorrectionHistoryPage;
