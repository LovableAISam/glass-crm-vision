import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import BalanceCorrectionList from '@src/packages/balance-correction/BalanceCorrectionList';

const BalanceCorrectionPage = () => (
  <DashboardContainer>
    <BalanceCorrectionList />
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

export default BalanceCorrectionPage;
