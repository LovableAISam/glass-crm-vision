import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import DirectPayment from '@src/packages/direct-payment/DirectPayment';

const DirectPaymentPage = () => (
  <DashboardContainer>
    <DirectPayment />
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
      ])),
    },
  };
}

export default DirectPaymentPage;
